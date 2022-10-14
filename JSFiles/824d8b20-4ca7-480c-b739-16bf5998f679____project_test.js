describe('FIDO 2.0 WebAPI Tests', function () {
  // _before_each.hbs
  before(function (done) {
        Actionwords.init (done);
    	this.actionwords = Actionwords;
  });

  it('Successful Registration', function () {
  // _body.hbs
    // Tags: WebAPI-S1-1
    // 1.1 Registration (embedded authenticator mode)
    // On the phone:
    // User goes to example.com in the browser, and signs in using whatever
    // method they have been using (possibly a pre-FIDO method such as a
    // password).
    // The phone prompts, "Do you want to register this device with example.com?"
    // User agrees.
    // The phone prompts the user for a previously configured authorization gesture
    // (PIN, biometric, etc.); the user provides this.
    // Website shows message, "Registration complete."
    // TODO: Implement action: "Browse to website {example.com}"
    // TODO: Implement action: "Authenticate with {username} and {password}"
    // TODO: Implement action: "Phone prompts user \"do you want to register this device with {example.com}\""
    // TODO: Implement action: "User agrees"
    // TODO: Implement action: "Phone prompts user for authorization gesture"
    // TODO: Implement action: "Website shows message \"registration complete\""
    this.skip();
  });

  it('Successful Authentication', function () {
  // _body.hbs
    // Tags: WebAPI-S1-2
    // 1.2 Authentication (external authenticator mode)
    // On the laptop:
    // User goes to example.com in browser, sees an option "Sign in with your
    // phone."
    // User chooses this option and gets a message from the browser, "Please
    // complete this action on your phone."
    // Next, on the phone:
    // User sees a discreet prompt or notification, "Sign in to example.com."
    // User selects this prompt / notification.
    // User is shown a list of their example.com identities, e.g., "Sign in as Alice /
    // Sign in as Bob."
    // User picks an identity, is prompted for an authorization gesture (PIN,
    // biometric, etc.) and provides this.
    // Now, on the laptop:
    // Web page shows that the selected user is signed in, and navigates to the
    // signed-in page.
    this.skip();
  });

  it('Must comply to FIDO Credential API', function () {
  // _body.hbs
    // Tags: WebAPI-S3 Authenticator
    // However, the behavior of FIDO 2.0: Web API for accessing FIDO 2.0 credentials the client's FIDO Credential API implementation, when operating on the embedded and external authenticators supported by that platform, MUST be indistinguishable from the behavior specified in the FIDO Credential API section.
    this.skip();
  });

  it('authenticatorMakeCredential when other operations in progress', function () {
  // _body.hbs
    // Tags: WebAPI-S3-1 Client
    // The authenticatorMakeCredential  must be invoked in an authenticator session which has no other
    // operations in progress
    this.skip();
  });

  it('authenticatorGetAssertion when other operations in progress copy', function () {
  // _body.hbs
    // Tags: WebAPI-S3-2 Client
    // The authenticatorGetAssertion operation must be invoked in an authenticator session which has no other operations in progress
    this.skip();
  });

  it('authenticatorCancel operation', function () {
  // _body.hbs
    // Tags: WebAPI-S3-3 Authenticator
    // When the authenticatorCancel operation is invoked by the client in an authenticator session, it has the effect of terminating any authenticatorMakeCredential or authenticatorGetAssertion operation currently in progress in that authenticator session.
    this.skip();
  });

  it('authenticator must stop operations when authenticatorCancel is called', function () {
  // _body.hbs
    // Tags: WebAPI-S3-3 Client Authenticator
    // The authenticator stops prompting for,
    // or accepting, any user input related to authorizing the canceled operation. The client
    // ignores any further responses from the authenticator for the canceled operation.
    this.skip();
  });

  it('authenticatorMakeCredential parameters', function () {
  // _body.hbs
    // Tags: WebAPI-S3-1
    // It takes the following input parameters:
    // The web origin of the script on whose behalf the operation is being initiated, as
    // determined by the user agent and the client.
    // The RP ID corresponding to the above web origin, as determined by the user agent
    // and the client.
    // All input parameters accepted by the getAssertion method, specified below.
    this.skip();
  });

  it('authenticatorMakeCredential obtains user consent', function () {
  // _body.hbs
    // Tags: WebAPI-S3-1
    // credential. The prompt for obtaining this consent is shown by the authenticator if it has its
    // own output capability, or by the user agent otherwise. Once user consent is obtained, the
    // authenticator generates the appropriate cryptographic keys and creates a new credential.
    this.skip();
  });

  it('authenticatorMakeCredential generates keys and credential associated with RP ID', function () {
  // _body.hbs
    // Tags: WebAPI-S3-1
    // Once user consent is obtained, the
    // authenticator generates the appropriate cryptographic keys and creates a new credential.
    // It then associates the credential with the specified RP ID such that it will be able to
    // retrieve the RP ID later, given the credential ID.
    this.skip();
  });

  it('authenticatorMakeCredential return value', function () {
  // _body.hbs
    // Tags: WebAPI-S3-1
    // On successful completion of this operation, the authenticator returns the type and unique
    // identifier of this new credential to the user agent.
    this.skip();
  });

  it('authenticatorMakeCredential refused consent', function () {
  // _body.hbs
    // Tags: WebAPI-S3-1
    // If the user refuses consent, the authenticator returns an appropriate error status to the
    // client.
    this.skip();
  });

  it('authenticatorGetAssertion paramters', function () {
  // _body.hbs
    // authenticatorGetAssertion takes the following input parameters:
    // The web origin of the script on whose behalf the operation is being initiated, as
    // determined by the user agent and the client.
    // The RP ID corresponding to the above web origin, as determined by the user agent
    // FIDO 2.0: Web API for accessing FIDO 2.0 credentials
    // 6 of 19
    // and the client.
    // All input parameters accepted by the makeCredential method, specified below.
    this.skip();
  });

  it('authenticatorGetAssertion select credentials and user consent', function () {
  // _body.hbs
    // Tags: WebAPI-S3-2
    // When this method is invoked, the authenticator allows the user to select a credential from
    // among the credentials associated with that Relying Party and matching the specified
    // criteria, then obtains user consent for using that credential. The prompt for obtaining this
    // consent may be shown by the authenticator if it has its own output capability, or by the
    // user agent otherwise.
    this.skip();
  });

  it('authenticatorGetAssertion return value', function () {
  // _body.hbs
    // Tags: WebAPI-S3-2
    // Once a credential is selected and user consent is obtained, the
    // authenticator computes a cryptographic signature using the credential's private key and
    // constructs an assertion as specified in [FIDOSignatureFormat]. It then returns this
    // assertion to the user agent.
    this.skip();
  });

  it('authenticatorGetAssertion no matching RP', function () {
  // _body.hbs
    // Tags: WebAPI-S3-2
    // If the authenticator cannot find any credential corresponding to the specified Relying
    // Party that matches the specified criteria, it terminates the operation and returns an error.
    this.skip();
  });

  it('authenticatorGetAssertion no consent', function () {
  // _body.hbs
    // Tags: WebAPI-S3-2
    // If the user refuses consent, the authenticator returns an appropriate error status to the
    // client
    this.skip();
  });

  it('authenticatorCancel ignored if nothing pending', function () {
  // _body.hbs
    // This operation is ignored if it is invoked in an authenticator session which does not have
    // an authenticatorMakeCredential or authenticatorGetAssertion operation currently in
    // progress.
    this.skip();
  });

  it('Credential API should run in secure context', function () {
  // _body.hbs
    // Tags: WebAPI-S4 Optional
    // User agents SHOULD only expose this API to callers in secure contexts, as defined in
    // [powerful-features].
    this.skip();
  });

  it('window.webauthn exists', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.actionwords.assertIsObject(window.webauthn, "window.webauthn should be an object");
  });

  it('window.webauthn.makeCredential exists', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.actionwords.assertIsFunction(window.webauthn.makeCredential, "window.fido.makeCredential should be a function");
  });

  it('window.webauthn.getAssertion exists', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.actionwords.assertIsFunction(window.webauthn.getAssertion, "window.webauthn.getAssertion should be a function");
  });

  it('ClientData members', function () {
  // _body.hbs
    // Tags: SigFormat-S3-1 Client Authenticator
    // ClientData must contain:
    // * challenge
    // * facet (RP ID)
    // * tokenBinding JWT (conditionally mandatory based on Token Binding)
    // * extensions (optional)
    // * hashAlg string
    // * other fields (optional)
    // 
    // Clients must format the data correctly. Authenticators must accept valid messages and reject invalid messages.
    // 
    // clientDataJSON is UTF-8 encoded and clientDataHash is a hash using hashAlg of clientDataJSON
    this.skip();
  });

  it('preserve encodedClientData string', function () {
  // _body.hbs
    // Tags: SigFormat-S3-1 Client
    // The client platform should also preserve the exact encodedClientData string used to create it, for embedding in a signature object sent back to the RP (see 5. Generating a signature). This is necessary since multiple JSON encodings of the same client data are possible.
    this.skip();
  });

  it('Test of User Presence (TUP) only set through gesture', function () {
  // _body.hbs
    // Tags: SigFormat-S4
    // The TUP flag shall be set if and only if the authenticator detected a user through an authenticator specific gesture
    this.skip();
  });

  it('RFU bits set to zero', function () {
  // _body.hbs
    // Tags: SigFormat-S4
    // The RFU bits in the flags byte shall be set to zero.
    this.skip();
  });

  it('Authenticator data, no extension', function () {
  // _body.hbs
    // Tags: SigFormat-S4
    // If the authenticator does not include any extension data, it must set the ED flag in the first byte to zero, and to one if extension data is included.
    this.skip();
  });

  it('Authenticator data, with extension', function () {
  // _body.hbs
    // Tags: SigFormat-S4
    // If the authenticator does not include any extension data, it must set the ED flag in the first byte to zero, and to one if extension data is included.
    // 
    // Extension-defined authenticator data is a CBOR [RFC7049] map with extension identifiers as keys, and extension authenticator data values as values
    this.skip();
  });

  it('Authenticator signature', function () {
  // _body.hbs
    // Tags: SigFormat-S5 Authenticator
    // An authenticator shall compute a signature over the concatenation of the authenticatorData and the clientDataHash.
    // 
    // The authenticator must return both the authenticatorData and the raw signature back to the client.
    this.skip();
  });

  it('FIDOAssertion members', function () {
  // _body.hbs
    // Tags: SigFormat-S6
    // FIDOAssertion must contiain:
    // * credential
    // * clientData
    // * authenticatorData
    // * signature
    this.skip();
  });

  it('Delivery of assertion to RP', function () {
  // _body.hbs
    // Tags: SigFormat-S6
    // This assertion is delivered to the RP in either a platform specific manner, or in the case of web applications, according to the FIDO Web API [FIDOWebApi].
    this.skip();
  });

  it('makeCredential extension', function () {
  // _body.hbs
    this.skip();
  });

  it('getAssertion extension', function () {
  // _body.hbs
    this.skip();
  });

  it('clientData extension', function () {
  // _body.hbs
    this.skip();
  });

  it('authenticatorData extension', function () {
  // _body.hbs
    this.skip();
  });

  it('Extensions that are not supported are ignored', function () {
  // _body.hbs
    // Tags: SigFormat-S7
    // Extensions that are not supported are ignored.
    // 
    // Applies to makeCredential, getAssertion, clientData, and authenticatorData.
    this.skip();
  });

  it('Third-party extensions don\'t use fido.', function () {
  // _body.hbs
    // Tags: SigFormat-S7-1
    // Standard extensions defined by FIDO in this specification use a fixed prefix of fido. for the extension identifiers. This prefix should not be used for 3rd party extensions.
    this.skip();
  });

  it('Client processing of extensions', function () {
  // _body.hbs
    // Tags: SigFormat-S7
    // The client platform performs additional processing for each extension that it supports, and augments clientData as required by the extension. For extensions that the client platform does not support, it passes the request parameters on to the authenticator when possible (criteria defined below).
    this.skip();
  });

  it('Third party extension definition', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2
    // A definition of an extension must specify, at minimum, an extension identifier and an extension client argument sent via the getAssertion or makeCredential call (see below).
    this.skip();
  });

  it('Valid values for client argument', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2-1
    // Extension definitions must specify the valid values for their client argument. Clients are free to ignore extensions with an invalid client argument.
    // 
    // An RP simultaneously requests the use of an extension and sets its client argument by including an entry in the extensions dictionary parameter to the getAssertion or makeCredential call. The entry key must be the extension identifier, and the value must be the client argument.
    this.skip();
  });

  it('Optional authenticator argument', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2-1 Optional
    // Specifying an authenticator argument is optional, since some extensions may only affect client processing.
    this.skip();
  });

  it('Unknown client argument pass-through', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2-1 Optional
    // To support this, platforms should pass the client argument of unknown extension as the authenticator argument unchanged, under the same extension identifier. The authenticator argument should be the CBOR encoding of the client argument, as specified in Section 4.2 of [RFC7049]. 
    this.skip();
  });

  it('Drop unknown extensions that cannot be encoded as CBOR', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2-1 Optional
    // To support this, platforms should pass the client argument of unknown extension as the authenticator argument unchanged, under the same extension identifier. The authenticator argument should be the CBOR encoding of the client argument, as specified in Section 4.2 of [RFC7049]. 
    this.skip();
  });

  it('Client extension results', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2-2 Optional
    // In order for the RP to verify the processing took place, or if the processing has a result value that the RP needs to be aware of, the extension should specify a client data value to be included in the clientData structure.
    // 
    // If any extension processed by a client defines such a value, the client should include a dictionary in clientData with the key extensions. For each such extension, the client should add an entry to this dictionary with the extension identifier as the key, and the extension's client data value.
    this.skip();
  });

  it('Authenticator processing with signature extensions', function () {
  // _body.hbs
    // Tags: SigFormat-S7-2-3
    // An authenticator that processes a signature extension that defines such a value must include it in the authenticatorData.
    this.skip();
  });

  it('fido.txauth.simple', function () {
  // _body.hbs
    // Tags: SigFormat-S7-3-1
    // Has the following requirements (may be separate test scenarios):
    // * A single UTF-8 encoded string prompt
    // * No client processing except default forwarding of client argument to authenticator argument
    // * Authenticator argument is the client argument encoded as a CBOR text string (major type 3).
    // * The authenticator must display the prompt to the user before performing the user verification / test of user presence. The authenticator may insert line breaks if needed
    // 
    // RP requirement: should reject transaction if returned string doesn't match?
    this.skip();
  });

  it('fido.txauth.generic', function () {
  // _body.hbs
    // Tags: SigFormat-S7-3-1
    // Has the following requirements (may be separate test scenarios):
    // * Arguments are CBOR map with one pair of data items (CBOR tagged as 0xa1) containing a contentType with the MIME-Type and the content itself as a byte array
    // * No client processing except default forwarding of client argument to authenticator argument
    // * Authenticator argument is the client argument encoded as a CBOR map
    // * The authenticator must display the content to the user before performing the user verification / test of user presence. The authenticator may add other information below the content. No changes are allowed to the content itself, i.e. inside content boundary box.
    // * The hash value of the content which was displayed. The authenticator must use the same hash algorithm as it uses for the signature itself
    // 
    // RP requirement: should reject transaction if hash doesn't match?
    this.skip();
  });

  it('fido.authn-sel only used during makeCredential', function () {
  // _body.hbs
    // Tags: SigFormat-S7-3-2
    // fido.authn-sel (only used during makeCredential)
    this.skip();
  });

  it('fido.authn-sel', function () {
  // _body.hbs
    // Has the following requirements (may be separate test scenarios):
    // * Client argument is a sequence of AAGUIDs
    // * If the client supports the Authenticator Selection Extension, it must use the first available authenticator whose AAGUID is present in the AuthenticatorSelectionList.
    // * If none of the available authenticators match a provided AAGUID, the client must select an authenticator from among the available authenticators to generate the credential.
    // * Not passed through to Authenticator
    this.skip();
  });

  it('Full Basic Attestation', function () {
  // _body.hbs
    // Tags: KeyAttestation-S2-1
    // In the case of full basic attestation [UAFProtocol], the Authenticator's attestation private key is specific to an Authenticator model. That means that an Authenticator of the same model typically shares the same attestation private key.
    this.skip();
  });

  it('Surrogate Basic Attestation', function () {
  // _body.hbs
    // Tags: KeyAttestation-S2-1
    // In the case of surrogate basic attestation [UAFProtocol], the Authenticator doesn't have any specific attestation key. Instead it uses the authentication key to (self-)sign the (surrogate) attestation message. Authenticators without meaningful protection measures for an attestation private key typically use this attestation model.
    this.skip();
  });

  it('Privacy CA', function () {
  // _body.hbs
    // Tags: KeyAttestation-S2-1
    // In this case, the authenticator owns an authenticator-specific (endorsement) key. This key is used to securely communicate with a trusted third party, the Privacy CA. The Authenticator can generate multiple attestation key pairs and asks the Privacy CA to issue an attestation certificate for it.
    this.skip();
  });

  it('Direct Anonymous Attestation (DAA)', function () {
  // _body.hbs
    // Tags: KeyAttestation-S2-1
    // In this case, the Authenticator receives DAA credentials from a single DAA-Issuer. These DAA credentials are used along with blinding to sign the attestation data. The concept of blinding avoids the DAA credentials being misused as global correlation handle.
    this.skip();
  });

  it('Servers must support all attestation models', function () {
  // _body.hbs
    // Tags: KeyAttestation-S2-1 Server
    // Compliant FIDO Servers must support all attestation models
    this.skip();
  });

  it('Servers must check bindings against expected values', function () {
  // _body.hbs
    // Tags: KeyAttestation-S2-2 Server
    // FIDO 2.0 attestation statements are bound to various contextual data. These data are observed, and added at different levels of the stack as a signature request passes from the server to the authenticator. In verifying a signature, the server checks these bindings against expected values.
    this.skip();
  });

  it('AttestationStatement header', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-1
    // header of type AttestationHeader, readonly
    // Attestation header, including algorithm, (optionally) the claimed AAGUID and (optionally) the attestation certificate chain.
    this.skip();
  });

  it('AttestationStatement core', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-1
    // core of type AttestationCore, readonly
    // AttestationCore object. This object includes the attested rawData and its type and version.
    this.skip();
  });

  it('AttestationStatement signature', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-1
    // signature of type DOMString, readonly
    // The base64url-encoded attestation signature. The structure of this object depends on the signature algorithm specified in the header.
    this.skip();
  });

  it('AttestationHeader claimedAAGUID', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-3
    // claimedAAGUID of type DOMString, readonly
    // The claimed Authenticator Attestation GUID (a version 4 GUID, see [RFC4122]). This value is used by the FIDO Server to lookup the trust anchor for verifying this AttestationCore object. If the verification succeeds, the AAGUID related to the trust anchor is trusted. This field must be present, if either no attestation certificates are used (e.g., DAA) or if the attestation certificate doesn't contain the AAGUID value in an extension.
    this.skip();
  });

  it('AttestationCore type', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-2
    // type of type DOMString, readonly
    // The type of the rawData object. This specification defines these attestation raw data types: "tpm", "packed", and "android". Other attestation raw data types may be defined in further versions of this specification.
    this.skip();
  });

  it('AttestationCore version', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-2
    // version of type unsigned long, readonly
    // The version number of the rawData object.
    this.skip();
  });

  it('AttestationCore rawData', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-2
    // rawData of type DOMString, readonly
    // The rawData object (for type "android"), or the base64url-encoded rawData object (for types "tpm" and "packed"), containing the attested public key and the clientDataHash.
    this.skip();
  });

  it('AttesationCore clientData', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-2
    // clientData of type DOMString, readonly
    // A base64url encoding of clientDataJSON [FIDOSignatureFormat]. The exact encoding must be preserved as the hash (clientDataHash) has been computed over it.
    // 
    // The client platform shall deliver, through the CTAP API, the clientDataHash (see [FIDOSignatureFormat]) to the authenticator. 
    // 
    // The client platform must also preserve the exact encodedClientData string (see [FIDOSignatureFormat]), for embedding in a signature object sent back to the RP. This is necessary since multiple JSON encodings of the same client data are possible.
    this.skip();
  });

  it('AttestationHeader x5c', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-3
    // x5c of type array of DOMString, readonly
    // Attestation Certificate and its certificate chain as described in [RFC7515] section 4.1.6.
    this.skip();
  });

  it('AttestationHeader alg', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-3
    // alg of type DOMString, readonly
    // The name of the algorithm used to generate the attestation signature according to [RFC7518].
    this.skip();
  });

  it('Packed Only version="1"', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // For this type, only version="1" is defined at this time.
    this.skip();
  });

  it('Packed rawData type', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // Attestation rawData (type="packed")
    this.skip();
  });

  it('rawData', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // The field rawData is the base64url encoding of the byte array. The encoding of attestation data (for type "packed") is a byte array of 45 bytes + length of public key + length of KeyHandle + potentially more extensions. 
    this.skip();
  });

  it('rawData TAG', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // First two bytes of rawData:
    // 0xF1D0, fixed big-endian TAG to make sure this object won't be confused with other (non-FIDO) binary objects.
    this.skip();
  });

  it('rawData flags', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // Third byte of rawData:
    // 
    // Flags (bit 0 is the least significant bit):
    // Bit 0: Test of User Presence (TUP) result.
    // Bits 1-6: Reserved for future use (RFU).
    // Bit 7: Extension data included (ED). Indicates whether the authenticator added extensions (see below).
    // 
    // The TUP flag shall be set if and only if the authenticator detected a user through an authenticator-specific gesture.
    // 
    // The RFU bits in the flags byte shall be cleared (i.e., zeroed).
    // 
    // If the authenticator does not wish to add extensions, it must clear the ED flag in the third byte.
    this.skip();
  });

  it('rawData signature counter', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // Bytes 4-7:
    // 
    // Signature counter (signCount), 32-bit unsigned big-endian integer.
    this.skip();
  });

  it('rawData public key algorithm and encoding', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // Bytes 8-9:
    // 
    // Public key algorithm and encoding (16-bit big-endian value). Allowed values are:
    // 0x0100. This is raw ANSI X9.62 formatted Elliptic Curve public key [SEC1].
    // I.e., [0x04, X (n bytes), Y (n bytes)]. Where the byte 0x04 denotes the uncompressed point compression method and n denotes the key length in bytes.
    // 
    // 0x0102. Raw encoded RSA PKCS1 or RSASSA-PSS public key [RFC3447].
    // In the case of RSASSA-PSS, the default parameters according to [RFC4055] must be assumed, i.e.,
    // 
    // Mask Generation Algorithm MGF1 with SHA256
    // Salt Length of 32 bytes, i.e., the length of a SHA256 hash value.
    // Trailer Field value of 1, which represents the trailer field with hexadecimal value 0xBC.
    // That is, [modulus (256 bytes), e (m-n bytes)]. Where m is the total length of the field.
    // 
    // This total length should be taken from the object containing this key
    this.skip();
  });

  it('rawData public key', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // Byte length m of following public key bytes (16 bit value with most significant byte first).
    // 
    // Followed by:
    // The public key (m bytes) according to the encoding denoted before.
    this.skip();
  });

  it('rawData KeyHandle', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // 2 byte length l of KeyHandle
    // 
    // Followed by:
    // KeyHandle (l bytes)
    this.skip();
  });

  it('rawData clientDataHash', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // 2 byte length n of clientDataHash
    // 
    // Followed by:
    // clientDataHash (see section 3.2.2 Client data). This is the hash of clientData. The hash algorithm itself is stored in the clientData object [FIDOSignatureFormat].
    this.skip();
  });

  it('rawData extension', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-1
    // Extension-defined authenticator data. This is a CBOR [RFC7049] map with extension identifiers as keys, and extension authenticator data values as values. See [FIDOSignatureFormat], section "Signature extensions" for a description of the extension mechanism. See section 3.4.1.2 Extensions for Packed Attestation rawData for pre-defined extensions.
    this.skip();
  });

  it('fido.aaguid extension', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-2-1
    // Authenticator processing
    // This extension is added automatically by the authenticator. This extension can be added to attestation statements and signatures.
    // Authenticator data
    // A 128-bit Authenticator Attestation GUID encoded as a CBOR text string (major type 3).
    // This AAGUID is used to identify the Authenticator model (Authenticator Attestation GUID).
    this.skip();
  });

  it('fido.exts extension', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-2-2
    // Authenticator processing
    // This extension is added automatically by the authenticator. This extension can be added to attestation statements.
    // Authenticator data
    // The SupportedExtension extension is a list (CBOR array) of extension identifiers encoded as UTF-8 Strings.
    this.skip();
  });

  it('fido.uvi extension', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-2-3
    // Authenticator processing
    // This extension is added automatically by the authenticator. This extension can be added to attestation statements and signatures.
    // Authenticator data
    // The user verification index (UVI) is a value uniquely identifying a user verification data record. The UVI is encoded as CBOR byte string (type 0x58).
    // Each UVI value must be specific to the related key (in order to provide unlinkability). It also must contain sufficient entropy that makes guessing impractical. UVI values must not be reused by the Authenticator (for other biometric data or users).
    // 
    // The UVI data can be used by FIDO Servers to understand whether an authentication was authorized by the exact same biometric data as the initial key generation. This allows the detection and prevention of "friendly fraud".
    // 
    // As an example, the UVI could be computed as SHA256(KeyID | SHA256(rawUVI)), where the rawUVI reflects (a) the biometric reference data, (b) the related OS level user ID and (c) an identifier which changes whenever a factory reset is performed for the device, e.g. rawUVI = biometricReferenceData | OSLevelUserID | FactoryResetCounter.
    // 
    // FIDO Servers supporting UVI extensions must support a length of up to 32 bytes for the UVI value.
    this.skip();
  });

  it('Packed Signature', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-3 Server Authenticator
    // The signature is computed over the base64url-decoded rawData field.
    // 
    // The following algorithms must be implemented by FIDO Servers:
    // "ES256" [RFC7518]
    // "RS256" [RFC7518]
    // "PS256" [RFC7518]
    // "ED256" [FIDOEcdaaAlgorithm]
    // 
    // Authenticators can choose which algorithm to implement.
    this.skip();
  });

  it('Attestation statement certificate requirements', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-1-4
    // The attestation certificate must have the following fields/extensions:
    // 
    // Version must be set to 3.
    // Subject field must be set to:
    // Subject-C
    // Country where the Authenticator vendor is incorporated
    // Subject-O
    // Legal name of the Authenticator vendor
    // Subject-OU
    // Authenticator Attestation
    // Subject-CN
    // No stipulation.
    // If the related attestation root certificate is used for multiple authenticator models, the following extension must be present:
    // Extension OID 1 3 6 1 4 1 45724 1 1 4 (id-fido-gen-ce-aaguid) containing the AAGUID as value.
    // 
    // The Basic Constraints extension must have the cA component set to false
    // An Authority Information Access (AIA) extension with entry id-ad-ocsp and a CRL Distribution Point extension [RFC5280] are both optional as the status of attestation certificates is available through the FIDO Metadata Service [FIDOMetadataService].
    // 
    // In the case of DAA attestation [FIDOEcdaaAlgorithm] no attestation certificate is used.
    this.skip();
  });

  it('TPM rawData type', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-1
    // rawData (type="tpm")
    this.skip();
  });

  it('TPMv1 rawData encoding', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-1
    // The value of rawData is the base64url encoding of a binary object. 
    // 
    // This binary object is either a TPM_CERTIFY_INFO or a TPM_CERTIFY_INFO2 structure [TPMv1-2-Part2] sections 11.1 and 11.2, if attestationStatement.core.version equals 1.
    this.skip();
  });

  it('TPM clientDataHash', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-1
    // The field "extraData" (in the case of TPMS_ATTEST) or the field "data" (in the case of TPM_CERTIFY_INFO or TPM_CERTIFY_INFO2) must contain the clientDataHash (see [FIDOSignatureFormat]).
    this.skip();
  });

  it('TPMv1 Signature', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-2
    // If attestationStatement.core.version equals 1, (i.e., for TPM 1.2), RSASSA-PKCS1-v1_5 signature algorithm (section 8.2 of [RFC3447]) can be used by FIDO Authenticators (i.e. attestationStatement.header.alg="RS256").
    // 
    // The signature is computed over the base64url-decoded rawData field
    // 
    // See section for the signature algorithms to be implemented by FIDO Servers.
    this.skip();
  });

  it('TPMv2 rawData encoding', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-1
    // The value of rawData is the base64url encoding of a binary object. 
    // 
    // If attestationStatement.core.version equals 2, it must be the base64url encoding of a TPMS_ATTEST structure as defined in [TPMv2-Part2] sections 10.12.9.
    this.skip();
  });

  it('TPMv2 Signature', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-2
    // If attestationStatement.core.version equals 2, the following algorithms can be used by FIDO Authenticators:
    // 
    // TPM_ALG_RSASSA (0x14). This is the same algorithm RSASSA-PKCS1-v1_5 as for version 1 but for use with TPMv2. attestationStatement.header.alg="RS256".
    // TPM_ALG_RSAPSS (0x16); attestationStatement.header.alg="PS256".
    // TPM_ALG_ECDSA (0x18); attestationStatement.header.alg="ES256".
    // TPM_ALG_ECDAA (0x1A); attestationStatement.header.alg="ED256".
    // TPM_ALG_SM2 (0x1B); attestationStatement.header.alg="SM256".
    // 
    // The signature is computed over the base64url-decoded rawData field
    // 
    // See section for the signature algorithms to be implemented by FIDO Servers.
    this.skip();
  });

  it('TPM Attestation Certificate', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-2-3
    // TPM attestation certificate must have the following fields/extensions:
    // 
    // Version must be set to 3.
    // Subject field must be set to empty.
    // The Subject Alternative Name extension must be set as defined in [TPMv2-EK-Profile] section 3.2.9 if "version" equals 2 and [TPMv1-2-Credential-Profiles] section 3.2.9 if "version" equals 1.
    // The Extended Key Usage extension must contain the "joint-iso-itu-t(2) internationalorganizations(23) 133 tcg-kp(8) tcg-kp-AIKCertificate(3)" OID.
    // The Basic Constraints extension must have the CA component set to false
    // An Authority Information Access (AIA) extension with entry id-ad-ocsp and a CRL Distribution Point extension [RFC5280] are both optional as the status of attestation certificates is available through the FIDO Metadata Service [FIDOMetadataService].
    this.skip();
  });

  it('Android Attestation and AndroidAttestationClientData', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3
    // Android attestation statement must always be used in conjunction with the more specific AndroidAttestationClientData (see section 3.4.3.4 AndroidAttestationClientData) in order to let the RP App store the public key in the attestation object.
    this.skip();
  });

  it('Android rawData type', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-1
    // Attestation rawData (type="android")
    this.skip();
  });

  it('Android rawData encoding', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-1 KeyAttestation-S3-4-3-3
    // Android SafetyNet returns a JWS [RFC7515] object (see SafetyNet online documentation) in Compact Serialization. A JWS in Compact Serialization consists of three segments (each a base64url-encoded string) separated by a dot ("."). The rawData object is the concatenation of:
    // 
    // the first segment (a base64url encoding of the UTF-8 encoded JWS Protected Header)
    // a dot "."
    // the second segment (a base64url encoding of the UTF-8 encoded JWS Payload).
    // In contrast to the "packed" and "tpm" attestation types, for the "android" attestation type, the rawData field and the rawData object are the same string. (In the "packed" and "tpm" attestation types the rawData field is the base64url-encoding of the rawData object.)
    // 
    // The Authenticator and/or platform should use the steps outlined below to create an attestationStatement from an Android SafetyNet response. It may use a different algorithm, as long as the results are the same.
    // 
    // create clientDataJSON with type AndroidAttestationClientData (see below) and compute clientData as base64url-encoded clientDataJSON.
    // provide the clientDataHash computed as the hash value of clientData as Nonce value when requesting the SafetyNet attestation.
    // take SafetyNet response snr. This is a JWS object ([RFC7515]).
    // extract the base64url-encoded Protected Header hdr from snr (see [RFC7515])
    // extract the base64url-encoded payload p from snr
    // extract the base64url-encoded signature s from snr
    // set AttestationStatement.core.rawData = hdr | "." | p
    // set AttestationStatement.signature = s
    // base64url-decode hdr into hdr-d
    // set AttestationStatement.header.alg = hdr-d.alg
    // if hdr-d.x5c is present, then set AttestationStatement.header.x5c = hdr-d.x5c
    // if hdr-d.x5u is present, then resolve the URL and add the retrieved certificate chain to AttestationStatement.header.x5c
    // set AttestationStatement.core.type = "android"
    // set AttestationStatement.core.version to the version number of Google Play Services responsible for providing the SafetyNet API
    this.skip();
  });

  it('Android signature', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-2
    // The signature is directly computed over the rawData field, as defined above (see [RFC7515] for more details). The third segment of the JWS returned by SafetyNet is the base64url encoding of this signature, and also becomes the AttestationStatement.signature.
    this.skip();
  });

  it('AndroidAttestationClientData publicKey', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-4-1
    // publicKey of type JsonWebKey
    // The public key generated by the Authenticator, as a JsonWebKey object (see [WebCryptoAPI]).
    this.skip();
  });

  it('AndroidAttestationClientData isInsideSecureHardware', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-4-1
    // isInsideSecureHardware of type boolean
    // true if the key resides inside secure hardware (e.g., Trusted Execution Environment (TEE) or Secure Element (SE)).
    this.skip();
  });

  it('AndroidAttestationClientData userAuthentication', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-4-1
    // userAuthentication of type DOMString
    // One of "none", "keyguard", or "fingerprint". none means that the user has not enrolled a fingerprint, or set up a secure lock screen, and that therefore the key has not been linked to user authentication. keyguard means that the generated key only be used after the user unlocks a secure lock screen. fingerprint means that each operation involving the generated key must be individually authorized by the user by presenting a fingerprint.
    this.skip();
  });

  it('AndroidAttestationClientData userAuthenticationValidityDurationSeconds', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-4-1
    // userAuthenticationValidityDurationSeconds of type optional unsigned long
    // If the userAuthentication is set to "keyguard", then this parameter specifies the duration of time (seconds) for which this key is authorized to be used after the user is successfully authenticated.
    this.skip();
  });

  it('AndroidAttestationClientData verification', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-4-3-4-2
    // A relying party shall verify the clientData contextual bindings (see step 4 in 3.5 Verifying an Attestation Statement as follows:
    // 
    // Check that AndroidAttestationClientData.challenge equals the attestationChallenge that was passed into the makeCredential call [FIDOWebApi].
    // Check that the facet and tokenBinding parameters in the AndroidAttestationClientData match the RP App.
    // Check that AndroidAttestationClientData.publicKey is the same key as the one returned in the FIDOCredentialInfo by the makeCredential call.
    // Check that the hash of the clientDataJSON matches the nonce attribute in the payload of the safetynetResponse JWS.
    // Check that the ctsProfileMatch attribute in the payload of the safetynetResponse is true.
    // Check that the apkPackageName attribute in the payload of the safetynetResponse matches package name of the application calling SafetyNet API.
    // Check that the apkDigestSha256 attribute in the payload of the safetynetResponse matches the package hash of the application calling SafetyNet API.
    // Check that the apkCertificateDigestSha256 attribute in the payload of the safetynetResponse matches the hash of the signing certificate of the application calling SafetyNet API.
    this.skip();
  });

  it('Attestation statement verification', function () {
  // _body.hbs
    // Tags: KeyAttestation-S3-5
    // Upon receiving an attestation statement, the relying party shall:
    // 
    // Verify that the attestation statement is properly formatted
    // If attestationSignature.alg is not ECDAA (e.g., not "ED256" and not "ED512"):
    // Lookup the attestation root certificate from a trusted source. The FIDO Metadata Service [FIDOMetadataService] provides an easy way to access such information. The header.claimedAAGUID can be used for this lookup.
    // Verify that the attestation certificate chain is valid and chains up to a trusted root (following [RFC5280]).
    // Verify that the attestation certificate has the right Extended Key Usage (EKU) based on the FIDO Authenticator type (as denoted by the header.type member). In case of a type="tpm", this EKU shall be OID "2.23.133.8.3".
    // If the attestation type is "android", verify that the attestation certificate is issued to the hostname "attest.android.com" (see SafetyNet online documentation).
    // Verify that all issuing CA certificates in the chain are valid and not revoked.
    // Verify the signature on core.rawData using the attestation certificate public key and algorithm as identified by header.alg.
    // Verify core.rawData syntax and that it doesn't contradict the signing algorithm specified in header.alg.
    // If the attestation certificate contains an extension with OID 1 3 6 1 4 1 45724 1 1 4 (id-fido-gen-ce-aaguid) verify that the value of this extension matches header.claimedAAGUID. This identifies the Authenticator model.
    // If such extension doesn't exist, the attestation root certificate is dedicated to a single Authenticator model.
    // If attestationSignature.alg is ECDAA (e.g., "ED256", "ED512"):
    // Lookup the DAA root key from a trusted source. The FIDO Metadata Service [FIDOMetadataService] provides an easy way to access such information. The header.claimedAAGUID can be used for this lookup.
    // Perform DAA-Verify on signature for core.rawData (see [FIDOEcdaaAlgorithm]).
    // Verify core.rawData syntax and that it doesn't contradict the signing algorithm specified in header.alg.
    // The DAA root key is dedicated to a single Authenticator model.
    // Verify the contextual bindings (e.g., channel binding) from the clientData (see Section 3.2.2 Client data).
    // Verify that user verification method and other authenticator characteristics related to this authenticator model, match the relying party policy. The FIDO Metadata Service [FIDOMetadataService] provides an easy way to access the authenticator characteristics.
    // The relying party may take any of the below actions when verification of an attestation statement fails:
    // Reject the request, such as a registration request, associated with the attestation statement.
    // Accept the request associated with the attestation statement but treat the attested FIDO Credential as one with surrogate basic attestation (see 2.1 Attestation Models), if policy allows it. If doing so, there is no cryptographic proof that the FIDO Credential has been generated by a particular Authenticator model. See [FIDOSecRef] and [UAFProtocol] for more details on the relevance on attestation.
    // Verification of attestation statements requires that the relying party trusts the root of the attestation certificate chain. Also, the relying party must have access to certificate status information for the intermediate CA certificates. The relying party must also be able to build the attestation certificate chain if the client didn't provide this chain in the attestation information.
    this.skip();
  });

  it('makeCredential returns Promise', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.actionwords.callMakeCredential(Helpers.account.default, Helpers.cryptoParameters.default, Helpers.attestationChallenge.default, undefined, undefined, undefined);
    this.actionwords.assertInstanceOf(Helpers.makeCredentialReturn, Promise, "makeCredential should return a promise");
  });

  it('makeCredential requires accountInformation argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    // First argument to AccountInformation:
    // 
    //  dictionary Account { 
    //       required DOMString rpDisplayName; 
    //       required DOMString displayName; 
    //       DOMString          name; 
    //       DOMString          id; 
    //       DOMString          imageUri; 
    //   };
    // 
    // Note that empty object is not an option, as rpDisplayName and displayName are required.
    this.skip();
  });

  it('makeCredential requires cryptoParameters argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    // Second argument is array of:
    // 
    //  dictionary FIDOCredentialParameters { 
    //       required CredentialType        type; 
    //       required AlgorithmIdentifier   algorithm; 
    //   }; 
    this.skip();
  });

  it('makeCredential requires attestationChallenge argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    // Third argument is attestationChallenge of type DOMString
    this.skip();
  });

  it('makeCredential accepts credentialTimeoutSeconds argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.skip();
  });

  it('makeCredential accepts credentialExtensions argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    // FIDOExtensions is an object, where each extensions is an entry in the dictionary.
    this.skip();
  });

  it('getAssertion returns Promise', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.skip();
  });

  it('getAssertion requires assertionChallenge argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.skip();
  });

  it('getAssertion accepts assertionTimeoutSeconds argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.skip();
  });

  it('getAssertion accepts whitelist argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.skip();
  });

  it('getAssertion accepts assertionExtensions argument', function () {
  // _body.hbs
    // Tags: WebAPI-S4
    this.skip();
  });
});
