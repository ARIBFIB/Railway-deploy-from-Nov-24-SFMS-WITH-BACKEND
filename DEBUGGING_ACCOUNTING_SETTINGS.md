# Debugging Accounting Settings Backend

## Issues Fixed

1. **Error Response Format**: Changed from `res.status(400).json(createError(...))` to proper JSON objects
2. **UUID Validation**: Added UUID format validation matching existing controllers
3. **Logging**: Added console logging for debugging
4. **Error Handling**: Improved error handling in all controllers

## Testing the Endpoints

### 1. Check Server is Running
```bash
cd server
npm run dev
```

### 2. Test with curl (replace TOKEN and FOUNDATION_ID):
```bash
# Test Trusted Senders Storage
curl -X GET http://localhost:3001/api/settings/trusted-senders-storage \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Test Accounting Templates
curl -X GET http://localhost:3001/api/settings/accounting-templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Check Browser Console
When testing from frontend, check:
- Network tab for the API calls
- Console for error messages
- Response status codes

## Common Issues

1. **401 Unauthorized**: Check if JWT token is valid and included in Authorization header
2. **400 Bad Request**: Check if foundation_id is present in JWT token
3. **500 Internal Server Error**: Check server logs for detailed error messages
4. **CORS Issues**: Verify CORS is configured correctly in server/config/cors.ts

## Frontend Integration Needed

The frontend components need to be updated to fetch data from these endpoints. Currently they use hardcoded state. Add fetch functions similar to `fetchAutomaticAccountingEntries` in SettingsModal.tsx.

