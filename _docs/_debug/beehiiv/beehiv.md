# Beehiiv API 404 Debugging Guide

## Summary of the Error

When attempting to subscribe users to a Beehiiv newsletter via the Beehiiv API, you may encounter this error:

```
HTTP/1.1 404 Not Found
```

This occurs when sending a POST request to:

```
https://api.beehiiv.com/v2/publications/{publication_id}/subscribers
```
with a valid API key and email address, but the API returns a 404 status code and no subscriber is added.

## Common Causes

| Cause                        | Status                                                  |
|------------------------------|--------------------------------------------------------|
| Wrong publication ID         | Verified: Correct ID confirmed in Beehiiv dashboard    |
| Wrong API key                | Verified: Correct API key for this publication         |
| API key lacks permissions    | Verified: API key has necessary permissions            |
| Wrong workspace              | Verified: Key and ID are from the same workspace       |
| Beehiiv account limitation   | Possible: May need to contact Beehiiv support          |

## Steps to Debug

1. **Verify your Publication ID**
   - Log into your Beehiiv dashboard and confirm the publication ID matches exactly.
   - Try both with and without the `pub_` prefix.

2. **Check API Key Permissions**
   - Ensure the API key is valid for the correct workspace/publication.
   - Some keys are limited to certain publications or actions.

3. **Test with curl**
   - Use the following command (replace the publication ID and email as needed):
     ```bash
     curl -v -X POST "https://api.beehiiv.com/v2/publications/{publication_id}/subscribers" \
       -H "Authorization: Bearer <YOUR_API_KEY>" \
       -H "Content-Type: application/json" \
       -d '{"email":"your@email.com"}'
     ```
   - Observe the HTTP status code and any error message.

4. **Restart your dev server after .env changes**

5. **Contact Beehiiv Support**
   - If you are certain your credentials are correct, contact Beehiiv support with your curl command and the 404 response for further assistance.

## Example of a Successful Response
A successful subscription should return a JSON response with subscriber details, e.g.:
```json
{
  "id": "...",
  "email": "your@email.com",
  "status": "active"
}
```

If you receive a 404, the request is not reaching a valid publication or the API key is not authorized.

---

**Always check both the publication ID and API key, and ensure they belong to the same Beehiiv workspace.**
