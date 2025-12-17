import torch
import copy

def fed_avg(weights):
    """
    Standard Federated Averaging.
    weights: List of state_dicts (OrderedDict) from clients.
    """
    if not weights:
        return None
        
    w_avg = copy.deepcopy(weights[0])
    
    # Iterate over all parameters
    for k in w_avg.keys():
        # Sum updates from all other clients
        for i in range(1, len(weights)):
            w_avg[k] += weights[i][k]
        
        # Average
        w_avg[k] = torch.div(w_avg[k], len(weights))
        
    return w_avg

def trimmed_mean(weights, malicious_percent=0.1):
    """
    Trimmed Mean Aggregation.
    Removes top and bottom k values for each parameter, then averages.
    k = int(num_clients * malicious_percent)
    weights: List of state_dicts.
    malicious_percent: Fraction of malicious clients (0.0 to 0.5).
    """
    if not weights:
        return None
        
    w_avg = copy.deepcopy(weights[0])
    num_clients = len(weights)
    k = int(num_clients * malicious_percent)
    
    # Iterate over all parameters
    for key in w_avg.keys():
        # Stack weights from all clients for this parameter: (num_clients, param_shape...)
        stacked = torch.stack([w[key] for w in weights])
        
        # Sort along the client dimension (dim=0)
        sorted_w, _ = torch.sort(stacked, dim=0)
        
        # Trim top k and bottom k
        if k > 0 and 2 * k < num_clients:
            sorted_w = sorted_w[k : num_clients - k]
        
        # Average the remaining
        w_avg[key] = torch.mean(sorted_w, dim=0)
        
    return w_avg
