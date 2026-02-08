"""
Dapr Integration Layer
Provides helper functions for Dapr State, Secrets, and Service Invocation
"""
import httpx
import os
import json
from typing import Any, Optional, Dict

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_BASE_URL = f"http://localhost:{DAPR_HTTP_PORT}"

class DaprClient:
    """Client for Dapr sidecar operations"""
    
    def __init__(self):
        self.base_url = DAPR_BASE_URL
        self.client = httpx.AsyncClient(timeout=10.0)
    
    # ============ STATE MANAGEMENT ============
    
    async def save_state(self, store_name: str, key: str, value: Any) -> bool:
        """Save state to Dapr state store"""
        try:
            url = f"{self.base_url}/v1.0/state/{store_name}"
            payload = [{
                "key": key,
                "value": value
            }]
            response = await self.client.post(url, json=payload)
            return response.status_code == 204
        except Exception as e:
            print(f"Dapr state save error: {e}")
            return False
    
    async def get_state(self, store_name: str, key: str) -> Optional[Any]:
        """Retrieve state from Dapr state store"""
        try:
            url = f"{self.base_url}/v1.0/state/{store_name}/{key}"
            response = await self.client.get(url)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Dapr state get error: {e}")
            return None
    
    async def delete_state(self, store_name: str, key: str) -> bool:
        """Delete state from Dapr state store"""
        try:
            url = f"{self.base_url}/v1.0/state/{store_name}/{key}"
            response = await self.client.delete(url)
            return response.status_code == 204
        except Exception as e:
            print(f"Dapr state delete error: {e}")
            return False
    
    # ============ SECRETS MANAGEMENT ============
    
    async def get_secret(self, store_name: str, secret_name: str) -> Optional[Dict[str, str]]:
        """Retrieve secret from Dapr secret store"""
        try:
            url = f"{self.base_url}/v1.0/secrets/{store_name}/{secret_name}"
            response = await self.client.get(url)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Dapr secret get error: {e}")
            return None
    
    # ============ SERVICE INVOCATION ============
    
    async def invoke_service(
        self, 
        app_id: str, 
        method: str, 
        data: Optional[Dict] = None,
        http_verb: str = "POST"
    ) -> Optional[Any]:
        """Invoke another service via Dapr service invocation"""
        try:
            url = f"{self.base_url}/v1.0/invoke/{app_id}/method/{method}"
            if http_verb.upper() == "GET":
                response = await self.client.get(url)
            elif http_verb.upper() == "POST":
                response = await self.client.post(url, json=data)
            elif http_verb.upper() == "DELETE":
                response = await self.client.delete(url)
            else:
                response = await self.client.put(url, json=data)
            
            if response.status_code in [200, 201, 204]:
                return response.json() if response.content else None
            return None
        except Exception as e:
            print(f"Dapr service invocation error: {e}")
            return None
    
    # ============ PUB/SUB ============
    
    async def publish_event(self, pubsub_name: str, topic: str, data: Dict) -> bool:
        """Publish event to Dapr pub/sub"""
        try:
            url = f"{self.base_url}/v1.0/publish/{pubsub_name}/{topic}"
            response = await self.client.post(url, json=data)
            return response.status_code == 204
        except Exception as e:
            print(f"Dapr publish error: {e}")
            return False
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Global instance
dapr = DaprClient()
