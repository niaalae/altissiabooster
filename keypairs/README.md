# SSL Certificates Directory

This directory is for storing SSL certificates if you plan to run the application over HTTPS.

## Contents

Place your SSL certificates here:
- `certificate.crt` - Your SSL certificate
- `private.key` - Your private key
- `ca_bundle.crt` - Certificate authority bundle (if needed)

## Note

- **Development**: SSL is not required for local development (localhost)
- **Production**: Use proper SSL certificates from a trusted CA (Let's Encrypt, etc.)
- **Security**: Never commit private keys to version control (they're in .gitignore)

## Generating Self-Signed Certificates (Development Only)

```bash
openssl req -x509 -newkey rsa:4096 -keyout private.key -out certificate.crt -days 365 -nodes
```

**Warning**: Self-signed certificates are for development only and will show security warnings in browsers.
