from cryptography.fernet import Fernet

# Generate and save a key for encryption (done once)
key = Fernet.generate_key()
cipher = Fernet(key)

def encrypt_data(data):
    """
    Encrypt the given data.
    """
    encrypted_data = cipher.encrypt(data.encode())
    return encrypted_data

def decrypt_data(encrypted_data):
    """
    Decrypt the given data.
    """
    decrypted_data = cipher.decrypt(encrypted_data).decode()
    return decrypted_data

# Example usage
original_data = 'user@example.com'
encrypted = encrypt_data(original_data)
decrypted = decrypt_data(encrypted)
print(f"Encrypted Data: {encrypted}")
print(f"Decrypted Data: {decrypted}")
