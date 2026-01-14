const key = process.argv[2];
if (!key) {
    console.error('No key provided');
    process.exit(1);
}

try {
    const parts = key.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('JWT Payload:', JSON.stringify(payload, null, 2));
} catch (e) {
    console.error('Error decoding JWT:', e.message);
}
