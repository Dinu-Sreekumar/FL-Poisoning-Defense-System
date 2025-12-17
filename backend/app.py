import torch
import torch.nn as nn
import torch.optim as optim
from flask import Flask, request, jsonify
from flask_cors import CORS
import copy
import random

from model import MLP
from data_loader import get_data
from aggregation import fed_avg, trimmed_mean

app = Flask(__name__)
CORS(app)

# Global State
INPUT_SIZE = 78
# Maintain separate models for each algorithm to allow simultaneous comparison
global_models = {
    'fed_avg': MLP(input_size=INPUT_SIZE),
    'detection_guard': MLP(input_size=INPUT_SIZE)
}
train_loader, test_loader = get_data(batch_size=32)
criterion = nn.CrossEntropyLoss()

# Helper to evaluate model
def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for inputs, labels in loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    return correct / total if total > 0 else 0.0

def train_client(model, data_loader, is_malicious=False):
    model.train()
    optimizer = optim.SGD(model.parameters(), lr=0.01)
    
    # Simulate training on FULL EPOCH to ensure convergence
    # We iterate through the entire data_loader
    total_loss = 0
    num_batches = 0
    
    for inputs, labels in data_loader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
        num_batches += 1
        
    avg_loss = total_loss / num_batches if num_batches > 0 else 0

    if is_malicious:
        # Mean Shift Attack (Nuclear Option)
        # Instead of random noise, we shift the weights by a large constant.
        # This guarantees that these updates are outliers (far from the mean).
        # FedAvg will be destroyed (average will shift massively).
        # DetectionGuard (Trimmed Mean) will cut these top/bottom values out.
        with torch.no_grad():
            for param in model.parameters():
                # Shift all weights by +10.0 (huge shift for neural net weights which are usually ~0.01)
                param.add_(10.0)
    
    return model.state_dict(), avg_loss

@app.route('/')
def index():
    return "DetectionGuard Backend is Running. Use /start_round to simulate training."

@app.route('/start_round', methods=['POST'])
def start_round():
    data = request.get_json()
    malicious_percent = data.get('malicious_percent', 0.0)
    algorithm = data.get('algorithm', 'fed_avg')
    
    # Normalize algorithm name to key
    algo_key = 'detection_guard' if algorithm == 'detection_guard' else 'fed_avg'
    
    num_clients = 20
    num_malicious = int(num_clients * malicious_percent)
    
    client_weights = []
    client_stats = []
    
    # Get the correct global model
    current_global_model = global_models[algo_key]
    
    # Simulate Clients
    for i in range(num_clients):
        is_malicious = i < num_malicious
        client_model = copy.deepcopy(current_global_model)
        
        # Train
        w, loss = train_client(client_model, train_loader, is_malicious)
        client_weights.append(w)
        
        client_stats.append({
            "id": i,
            "is_malicious": is_malicious,
            "status": "Attacking" if is_malicious else "Training",
            "loss": loss
        })
    
    # Aggregation
    if algo_key == 'detection_guard':
        # Use trimmed mean with exact malicious percent as per paper
        new_weights = trimmed_mean(client_weights, malicious_percent=malicious_percent)
        algo_log = "DetectionGuard: Trimmed Mean aggregation applied."
    else:
        new_weights = fed_avg(client_weights)
        algo_log = "FedAvg: Standard mean aggregation applied."
        
    # Update Global Model
    current_global_model.load_state_dict(new_weights)
    
    # Evaluate
    acc = evaluate(current_global_model, test_loader)
    
    # Generate Logs
    logs = [
        f"Round initialized with {num_clients} clients ({malicious_percent*100:.0f}% malicious).",
        f"Training complete. Avg Loss: {sum(c['loss'] for c in client_stats)/num_clients:.4f}",
        algo_log,
        f"Global Model Updated. Accuracy: {acc*100:.2f}%"
    ]
    
    return jsonify({
        "global_accuracy": acc,
        "clients": client_stats,
        "algorithm": algorithm,
        "malicious_percent": malicious_percent,
        "logs": logs
    })

@app.route('/reset', methods=['POST'])
def reset_model():
    global global_models
    global_models = {
        'fed_avg': MLP(input_size=INPUT_SIZE),
        'detection_guard': MLP(input_size=INPUT_SIZE)
    }
    return jsonify({"message": "All global models reset successfully."})

if __name__ == '__main__':
    print("Starting DetectionGuard Backend...")
    app.run(host='0.0.0.0', port=5000, debug=True)
