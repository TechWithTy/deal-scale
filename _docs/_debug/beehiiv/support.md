# Support Ticket: Beehiiv API 404 Error

## Issue Description
User is encountering a 404 Not Found error when attempting to subscribe users to a Beehiiv newsletter via the API.

## Error Details
- **HTTP Status**: 404 Not Found
- **Endpoint**: `https://api.beehiiv.com/v2/publications/{publication_id}/subscribers`
- **Method**: POST
- **Headers**: Valid API key and Content-Type
- **Payload**: Valid email address

## Troubleshooting Steps Taken
1. Verified Publication ID in Beehiiv dashboard
2. Confirmed API key correctness
3. Checked API key permissions
4. Ensured key and ID are from the same workspace
5. Tested with curl command:
   ```bash
   curl -v -X POST "https://api.beehiiv.com/v2/publications/{publication_id}/subscribers" \
     -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"email":"your@email.com"}'
   ```
6. Restarted dev server after .env changes

## Possible Causes
- Incorrect publication ID
- Invalid API key
- Insufficient API key permissions
- Mismatched workspace
- Beehiiv account limitation

## Expected Behavior
A successful subscription should return a JSON response with subscriber details:
```json
{
  "id": "...",
  "email": "your@email.com",
  "status": "active"
}
```

## Additional Notes
- User has double-checked both publication ID and API key
- Both credentials belong to the same Beehiiv workspace

## Next Steps
Please investigate why the API is returning a 404 error despite valid credentials and permissions. User requests assistance in resolving this issue to successfully add subscribers via the API.
