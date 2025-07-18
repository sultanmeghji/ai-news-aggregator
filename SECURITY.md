# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue
Please do not open a public GitHub issue for security vulnerabilities. This helps protect users who haven't yet updated their installations.

### 2. Report Privately
Send an email to the project maintainers or use GitHub's private vulnerability reporting feature if available.

**What to Include:**
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if you have one)

### 3. Response Timeline
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Fix Timeline**: Depends on severity, but typically within 30 days
- **Public Disclosure**: After fix is released and users have had time to update

## Security Considerations

### API Keys and Environment Variables
- Never commit `.env` files or API keys to version control
- Use environment variables for all sensitive configuration
- Regularly rotate API keys
- Use the minimum required API permissions

### Dependencies
- We regularly update dependencies to patch security vulnerabilities
- Use `npm audit` to check for known vulnerabilities
- Report any dependency vulnerabilities you discover

### Data Storage
- The application uses CSV files for local storage
- No sensitive data is stored in CSV files
- API keys are only stored in environment variables
- No user authentication data is persisted

### Network Security
- All API calls use HTTPS
- Rate limiting is implemented to prevent abuse
- Input validation is performed on all user inputs
- CORS is configured appropriately

## Best Practices for Users

### Environment Setup
```bash
# Use a .env file for API keys
NEWS_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
SOCIAL_PILOT_API_KEY=your_key_here

# Set appropriate file permissions
chmod 600 .env
```

### Production Deployment
- Use HTTPS in production
- Set appropriate CORS headers
- Use environment variables for configuration
- Regularly update dependencies
- Monitor for unusual API usage patterns

### Development Security
- Don't commit sensitive files
- Use different API keys for development and production
- Keep your development environment updated
- Review code changes for security implications

## Common Security Issues to Avoid

### 1. API Key Exposure
❌ **Don't do this:**
```javascript
const API_KEY = 'your-actual-api-key-here';
```

✅ **Do this:**
```javascript
const API_KEY = process.env.NEWS_API_KEY;
```

### 2. Unvalidated Input
❌ **Don't do this:**
```javascript
app.post('/api/search', (req, res) => {
  const query = req.body.query; // No validation
});
```

✅ **Do this:**
```javascript
app.post('/api/search', (req, res) => {
  const { query } = searchSchema.parse(req.body);
});
```

### 3. Exposed Error Messages
❌ **Don't do this:**
```javascript
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

✅ **Do this:**
```javascript
} catch (error) {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

## Security Testing

### Manual Testing
- Test with invalid API keys
- Test with malformed requests
- Test rate limiting behavior
- Verify error handling doesn't expose sensitive information

### Automated Testing
- Use `npm audit` regularly
- Monitor dependency vulnerabilities
- Test API endpoint security
- Validate input sanitization

## Incident Response

If a security incident occurs:

1. **Immediate Response**
   - Assess the scope and impact
   - Implement temporary mitigations
   - Document the incident

2. **Investigation**
   - Identify root cause
   - Determine what data was affected
   - Review access logs

3. **Resolution**
   - Implement permanent fixes
   - Update security measures
   - Notify affected users if necessary

4. **Post-Incident**
   - Conduct post-mortem analysis
   - Update security procedures
   - Implement additional safeguards

## Security Resources

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Documentation](https://docs.npmjs.com/audit)

### Project-Specific Resources
- [Contributing Guidelines](CONTRIBUTING.md)
- [Installation Guide](README.md)
- [Quick Start Guide](QUICK_START.md)

## Contact

For security-related questions or concerns:
- Review this security policy
- Check existing documentation
- Contact maintainers privately for sensitive issues

Thank you for helping keep the AI News Aggregator project secure!