import unittest
import torch
import json
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from app import app
from data_loader import get_data
from model import MLP
from aggregation import fed_avg, trimmed_mean

class TestBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_data_loader(self):
        print("\nTesting Data Loader...")
        train, test = get_data(batch_size=10)
        self.assertIsNotNone(train)
        self.assertIsNotNone(test)
        batch = next(iter(train))
        self.assertEqual(len(batch), 2) # inputs, labels
        print("Data Loader OK.")

    def test_model(self):
        print("\nTesting Model...")
        model = MLP(input_size=78)
        x = torch.randn(5, 78)
        out = model(x)
        self.assertEqual(out.shape, (5, 2))
        print("Model OK.")

    def test_aggregation(self):
        print("\nTesting Aggregation...")
        # Create dummy weights
        w1 = {'fc1.weight': torch.ones(2, 2)}
        w2 = {'fc1.weight': torch.zeros(2, 2)}
        w3 = {'fc1.weight': torch.ones(2, 2) * 2}
        
        # FedAvg: (1+0+2)/3 = 1
        avg = fed_avg([w1, w2, w3])
        self.assertTrue(torch.allclose(avg['fc1.weight'], torch.ones(2, 2)))
        
        # Trimmed Mean (beta=0.3 -> trim 1 from each end? 3 items, 3*0.3=0.9 -> 0? 
        # If beta=0.1, 3*0.1=0.3 -> 0.
        # Let's try 5 items to be safe for trimming
        w_list = [{'p': torch.tensor([float(i)])} for i in range(5)]
        # 0, 1, 2, 3, 4. Mean = 2.
        # Trim 1 (20%): remove 0 and 4. Remaining: 1, 2, 3. Mean = 2.
        t_avg = trimmed_mean(w_list, malicious_percent=0.2)
        self.assertTrue(torch.allclose(t_avg['p'], torch.tensor([2.0])))
        print("Aggregation OK.")

    def test_api_start_round(self):
        print("\nTesting API /start_round...")
        # Test FedAvg
        payload = {"malicious_percent": 0.0, "algorithm": "fed_avg"}
        response = self.app.post('/start_round', json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('global_accuracy', data)
        self.assertIn('clients', data)
        self.assertEqual(len(data['clients']), 20)
        
        # Test DetectionGuard (Trimmed Mean) with Attack
        payload = {"malicious_percent": 0.3, "algorithm": "detection_guard"}
        response = self.app.post('/start_round', json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('global_accuracy', data)
        self.assertEqual(data['algorithm'], 'detection_guard')
        print("API OK.")

if __name__ == '__main__':
    unittest.main()
