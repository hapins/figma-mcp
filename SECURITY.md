# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to [security contact email]. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

1. Description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact
4. Suggested fix (if any)

## Security Measures

This project follows these security practices:

1. Dependencies are regularly updated and monitored for vulnerabilities using GitHub's Dependabot
2. Access tokens and sensitive information are handled securely through environment variables
3. All code changes go through review before being merged
4. Regular security audits of dependencies using `npm audit`

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Updates will be published as new versions following semantic versioning guidelines.

## Best Practices for Users

1. Always use the latest version of the package
2. Keep your Figma access token secure and never commit it to version control
3. Use environment variables or secure configuration management for storing sensitive information
4. Regularly update dependencies in your projects that use this package
