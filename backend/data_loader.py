import os
import torch
import pandas as pd
import numpy as np
from torch.utils.data import DataLoader, TensorDataset

# Constants
DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/CICIDS2017_sample.csv')
INPUT_SIZE = 78  # Standard feature count for CICIDS2017 (approx)
NUM_CLASSES = 2  # Binary classification (Benign vs Malicious)

def get_data(batch_size=32):
    """
    Loads data from CSV or generates mock data if file is missing.
    Returns: train_loader, test_loader
    """
    if os.path.exists(DATA_PATH):
        print(f"Loading data from {DATA_PATH}...")
        try:
            df = pd.read_csv(DATA_PATH)
            # Basic preprocessing assumption: last column is label, others are features
            # This is a simplified loader. In real scenario, more cleaning is needed.
            X = df.iloc[:, :-1].values.astype(np.float32)
            y = df.iloc[:, -1].values.astype(np.longlong)
            
            # Ensure input size matches
            if X.shape[1] != INPUT_SIZE:
                print(f"Warning: Data has {X.shape[1]} features, expected {INPUT_SIZE}. Adjusting model input might be needed.")
                # For now, we'll just slice or pad if strictly needed, but let's just return what we have
                # and let the model crash or user adjust if mismatch. 
                # Actually, better to just use the data's shape.
                pass
                
        except Exception as e:
            print(f"Error loading data: {e}. Falling back to mock data.")
            return generate_mock_data(batch_size)
    else:
        print(f"Data file not found at {DATA_PATH}. Generating mock data...")
        return generate_mock_data(batch_size)

    # Split into train/test (80/20)
    dataset = TensorDataset(torch.from_numpy(X), torch.from_numpy(y))
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])

    # Feature Normalization (StandardScaler)
    # We need to access the underlying data to fit the scaler
    # Since random_split wraps the dataset, we get indices. 
    # Let's do scaling BEFORE creating TensorDataset for simplicity in this script,
    # OR better, extract train indices and fit.
    
    # Re-doing split logic to handle scaling properly
    indices = list(range(len(X)))
    np.random.shuffle(indices)
    train_indices = indices[:train_size]
    test_indices = indices[train_size:]
    
    X_train = X[train_indices]
    X_test = X[test_indices]
    y_train = y[train_indices]
    y_test = y[test_indices]
    
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    # Convert back to tensors
    train_dataset = TensorDataset(torch.from_numpy(X_train), torch.from_numpy(y_train))
    test_dataset = TensorDataset(torch.from_numpy(X_test), torch.from_numpy(y_test))

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    return train_loader, test_loader

def generate_mock_data(batch_size=32, num_samples=1000):
    """
    Generates structured mock data for testing using sklearn.
    """
    print("Generating structured mock data (learnable)...")
    from sklearn.datasets import make_classification
    from sklearn.preprocessing import StandardScaler
    
    # Generate learnable data
    # n_informative=20 means 20 features actually predict the class
    X, y = make_classification(n_samples=num_samples, n_features=INPUT_SIZE, 
                               n_informative=20, n_redundant=10, 
                               n_classes=NUM_CLASSES, flip_y=0.05, random_state=42)
                               
    X = X.astype(np.float32)
    y = y.astype(np.longlong)
    
    # Scale it (StandardScaler)
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    dataset = TensorDataset(torch.from_numpy(X), torch.from_numpy(y))
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    return train_loader, test_loader

if __name__ == "__main__":
    train, test = get_data()
    print(f"Data loaded. Train batches: {len(train)}, Test batches: {len(test)}")
