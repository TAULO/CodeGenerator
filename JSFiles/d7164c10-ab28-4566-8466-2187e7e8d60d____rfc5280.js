//const Buffer = require('node:util').buffer;
const fs = require('node:fs');
const url = require('node:url');
const assert = require('node:assert');

const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-datetime'));
chai.use(require('chai-match'));
const expect = chai.expect;
const jsrsasign = require('jsrsasign');

const phoneOut = process.env.PHONE_OUT || false;

const binaryParser = function(res, cb) {
    res.setEncoding("binary");
    res.data = "";
    res.on("data", function (chunk) {
        res.data += chunk;
    });
    res.on("end", function () {
        cb(null, Buffer.from(res.data, "binary"));
    });
};

describe('RFC5280', function() {
   describe('5. CRL and CRL Extensions Profile', function() {
      /* As discussed above, one goal of this X.509 v2 CRL profile is to
      foster the creation of an interoperable and reusable Internet PKI.
      To achieve this goal, guidelines for the use of extensions are
      specified, and some assumptions are made about the nature of
      information included in the CRL.

      CRLs may be used in a wide range of applications and environments
      covering a broad spectrum of interoperability goals and an even
      broader spectrum of operational and assurance requirements.  This
      profile establishes a common baseline for generic applications
      requiring broad interoperability.  The profile defines a set of
      information that can be expected in every CRL.  Also, the profile
      defines common locations within the CRL for frequently used
      attributes as well as common representations for these attributes. */
      let crlFile = process.env.CRL_FILE || 'test.crl';

      /* CRL issuers issue CRLs.  The CRL issuer is either the CA or an entity
      that has been authorized by the CA to issue CRLs.  CAs publish CRLs
      to provide status information about the certificates they issued.
      However, a CA may delegate this responsibility to another trusted
      authority. */
      let crlIssuerCert = process.env.CRL_ISSUER_CERT || 'test.ca.crt.pem';
      let crlCaCert = process.env.CRL_CA_CERT || crlIssuerCert;

      /* Each CRL has a particular scope.  The CRL scope is the set of
      certificates that could appear on a given CRL.  For example, the
      scope could be "all certificates issued by CA X", "all CA
      certificates issued by CA X", "all certificates issued by CA X that
      have been revoked for reasons of key compromise and CA compromise",
      or a set of certificates based on arbitrary local information, such
      as "all certificates issued to the NIST employees located in
      Boulder".

      A complete CRL lists all unexpired certificates, within its scope,
      that have been revoked for one of the revocation reasons covered by
      the CRL scope.  A full and complete CRL lists all unexpired
      certificates issued by a CA that have been revoked for any reason.
      (Note that since CAs and CRL issuers are identified by name, the
      scope of a CRL is not affected by the key used to sign the CRL or the
      key(s) used to sign certificates.)

      If the scope of the CRL includes one or more certificates issued by
      an entity other than the CRL issuer, then it is an indirect CRL.  The
      scope of an indirect CRL may be limited to certificates issued by a
      single CA or may include certificates issued by multiple CAs.  If the
      issuer of the indirect CRL is a CA, then the scope of the indirect
      CRL MAY also include certificates issued by the issuer of the CRL.

      The CRL issuer MAY also generate delta CRLs.  A delta CRL only lists
      those certificates, within its scope, whose revocation status has
      changed since the issuance of a referenced complete CRL.  The
      referenced complete CRL is referred to as a base CRL.  The scope of a
      delta CRL MUST be the same as the base CRL that it references.

      This profile defines one private Internet CRL extension but does not
      define any private CRL entry extensions.

      Environments with additional or special purpose requirements may
      build on this profile or may replace it.

      Conforming CAs are not required to issue CRLs if other revocation or
      certificate status mechanisms are provided.  When CRLs are issued,
      the CRLs MUST be version 2 CRLs, include the date by which the next
      CRL will be issued in the nextUpdate field (Section 5.1.2.5), include
      the CRL number extension (Section 5.2.3), and include the authority
      key identifier extension (Section 5.2.1).  Conforming applications
      that support CRLs are REQUIRED to process both version 1 and version
      2 complete CRLs that provide revocation information for all
      certificates issued by one CA.  Conforming applications are not
      required to support processing of delta CRLs, indirect CRLs, or CRLs
      with a scope other than all certificates issued by one CA. */

      let raw;
      let der;
      let pem;
      let crl;
      let parsed;

      before(function(done) {
         return fs.readFile(crlFile, (err, buf) => {
            assert.equal(err, undefined);
            raw = buf;
            done();		  
         });
      });
      before(function() {
         let str = raw.toString('utf8');
         if (/^-{5}BEGIN X509 CRL-{5}/.test(str)) {
            pem = str;
            let b64 = pem.replaceAll(/(^-{5}(BEGIN|END) X509 CRL-{5}|[\n\r])/gm, '');
            der = Buffer.from(b64, 'base64');
         }
         else {	       
            der = raw;
         }
      });

      describe('5.1 CRL Fields', function() {
         /* The X.509 v2 CRL syntax is as follows.  For signature calculation,
         the data that is to be signed is ASN.1 DER encoded.  ASN.1 DER
         encoding is a tag, length, value encoding system for each element.

         CertificateList  ::=  SEQUENCE  {
              tbsCertList          TBSCertList,
              signatureAlgorithm   AlgorithmIdentifier,
              signatureValue       BIT STRING  }

         TBSCertList  ::=  SEQUENCE  {
              version                 Version OPTIONAL,
                                           -- if present, MUST be v2
              signature               AlgorithmIdentifier,
              issuer                  Name,
              thisUpdate              Time,
              nextUpdate              Time OPTIONAL,
              revokedCertificates     SEQUENCE OF SEQUENCE  {
                   userCertificate         CertificateSerialNumber,
                   revocationDate          Time,
                   crlEntryExtensions      Extensions OPTIONAL
                                            -- if present, version MUST be v2
                                        }  OPTIONAL,
              crlExtensions           [0]  EXPLICIT Extensions OPTIONAL
                                            -- if present, version MUST be v2
                                        }

         -- Version, Time, CertificateSerialNumber, and Extensions
         -- are all defined in the ASN.1 in Section 4.1
   
         -- AlgorithmIdentifier is defined in Section 4.1.1.2

         The following items describe the use of the X.509 v2 CRL in the
         Internet PKI. */

         it('is DER encoded', function() {
            expect(pem).to.be.undefined; 
         });
         it('is strict ASN.1', function() {
            let hex = der.toString('hex');
            expect(jsrsasign.ASN1HEX.isASN1HEX(hex)).to.be.true;
         });		  
         it('can be parsed', function() {
             if (der === undefined) {
                this.skip();
             }
             else {
                crl = new jsrsasign.X509CRL(der.toString('hex'));
                //console.log(`crl: ${JSON.stringify(crl.getParam(), null, 4)}`);
                parsed = crl.getParam();
            }
         });
         describe('5.1.1 CertificateList Fields', function() {
            /* The CertificateList is a SEQUENCE of three required fields.  The
            fields are described in detail in the following subsections. */
            before(function() {
                if (parsed === undefined) this.skip();
            });
            describe('5.1.1.1 tbsCertList', function() {
               /* The first field in the sequence is the tbsCertList.  This field is
               itself a sequence containing the name of the issuer, issue date,
               issue date of the next list, the optional list of revoked
               certificates, and optional CRL extensions.  When there are no revoked
               certificates, the revoked certificates list is absent.  When one or
               more certificates are revoked, each entry on the revoked certificate
               list is defined by a sequence of user certificate serial number,
               revocation date, and optional CRL entry extensions. */
            });
            describe('5.1.1.2. signatureAlgorithm', function() {
               /* The signatureAlgorithm field contains the algorithm identifier for
               the algorithm used by the CRL issuer to sign the CertificateList.
               The field is of type AlgorithmIdentifier, which is defined in Section
               4.1.1.2.  [RFC3279], [RFC4055], and [RFC4491] list supported
               algorithms for this specification, but other signature algorithms MAY
               also be supported.

               This field MUST contain the same algorithm identifier as the
               signature field in the sequence tbsCertList (Section 5.1.2.2). */
               it('is present', function() {
                  expect(parsed.sigalg).to.be.a.string;
               });
            });
            describe('5.1.1.3. signatureValue', function() {
               /* The signatureValue field contains a digital signature computed upon
               the ASN.1 DER encoded tbsCertList.  The ASN.1 DER encoded tbsCertList
               is used as the input to the signature function.  This signature value
               is encoded as a BIT STRING and included in the CRL signatureValue
               field.  The details of this process are specified for each of the
               supported algorithms in [RFC3279], [RFC4055], and [RFC4491]. */
               it('is present', function() {
                  expect(parsed.sighex).to.be.a.string;
               });
               /* CAs that are also CRL issuers MAY use one private key to digitally
               sign certificates and CRLs, or MAY use separate private keys to
               digitally sign certificates and CRLs.  When separate private keys are
               employed, each of the public keys associated with these private keys
               is placed in a separate certificate, one with the keyCertSign bit set
               in the key usage extension, and one with the cRLSign bit set in the
               key usage extension (Section 4.2.1.3).  When separate private keys
               are employed, certificates issued by the CA contain one authority key
               identifier, and the corresponding CRLs contain a different authority
               key identifier.  The use of separate CA certificates for validation
               of certificate signatures and CRL signatures can offer improved
               security characteristics; however, it imposes a burden on
               applications, and it might limit interoperability.  Many applications
               construct a certification path, and then validate the certification
               path (Section 6).  CRL checking in turn requires a separate
               certification path to be constructed and validated for the CA's CRL
               signature validation certificate.  Applications that perform CRL
               checking MUST support certification path validation when certificates
               and CRLs are digitally signed with the same CA private key.  These
               applications SHOULD support certification path validation when
               certificates and CRLs are digitally signed with different CA private
               keys */
               it('can be verified', function(done) {
                  fs.readFile(crlCaCert, function(err, pem) {
                     expect(err).to.be.null;
                     let key = jsrsasign.X509.getPublicKeyFromCertPEM(pem.toString());
                     let result = false;
                     try {
                         result = crl.verifySignature(key);
                     }
                     catch {}
                     expect(result).to.be.true;
                     done();
                  });
               });
            });
         });
         describe('5.1.2. Certificate List "To Be Signed"', function() {
            /* The certificate list to be signed, or TBSCertList, is a sequence of
            required and optional fields.  The required fields identify the CRL
            issuer, the algorithm used to sign the CRL, and the date and time the
            CRL was issued.

            Optional fields include the date and time by which the CRL issuer
            will issue the next CRL, lists of revoked certificates, and CRL
            extensions.  The revoked certificate list is optional to support the
            case where a CA has not revoked any unexpired certificates that it
            has issued.  This profile requires conforming CRL issuers to include
            the nextUpdate field and the CRL number and authority key identifier
            CRL extensions in all CRLs issued. */
            describe('5.1.2.1 Version', function() {
               /* This optional field describes the version of the encoded CRL.  When
               extensions are used, as required by this profile, this field MUST be
               present and MUST specify version 2 (the integer value is 1). */
               it('has version v2', function() {
                  if (parsed.version)
                     expect(parsed.version).to.be.equal(2);
                  else
                     this.skip();
               });
            });
            describe('5.1.2.2. Signature', function() {
               /* This field contains the algorithm identifier for the algorithm used
               to sign the CRL.  [RFC3279], [RFC4055], and [RFC4491] list OIDs for
               the most popular signature algorithms used in the Internet PKI. */

               it('is present', function() {
                  expect(parsed.signature).not.to.be.null;
               });
               /* This field MUST contain the same algorithm identifier as the
               signatureAlgorithm field in the sequence CertificateList (Section
               5.1.1.2). */
               it('contains the same algorithm identifier', function() {
                  this.skip();
               });
            });
            describe('5.1.2.3. Issuer Name', function() {
               /* The issuer name identifies the entity that has signed and issued the
               CRL.  The issuer identity is carried in the issuer field.
               Alternative name forms may also appear in the issuerAltName extension
               (Section 5.2.2).  The issuer field MUST contain a non-empty X.500
               distinguished name (DN).  The issuer field is defined as the X.501
               type Name, and MUST follow the encoding rules for the issuer name
               field in the certificate (Section 4.1.2.4). */
               it('is present', function() {
                  expect(parsed.issuername).not.to.be.null;
               });
            });
            describe('5.1.2.4. This Update', function() {
               /* This field indicates the issue date of this CRL.  thisUpdate may be
               encoded as UTCTime or GeneralizedTime. */

               it('has thisupdate', function() {
                  let thisUpdate = jsrsasign.zulutodate(parsed.thisupdate);
                  expect(thisUpdate).to.be.a.string;
               });

               /* CRL issuers conforming to this profile MUST encode thisUpdate as
               UTCTime for dates through the year 2049.  CRL issuers conforming to
               this profile MUST encode thisUpdate as GeneralizedTime for dates in
               the year 2050 or later.  Conforming applications MUST be able to
               process dates that are encoded in either UTCTime or GeneralizedTime. */
               it('is encoded as UTCTime', function() {
                  let thisUpdate = jsrsasign.zulutodate(parsed.thisupdate);
                  let border = new Date('2050-01-01T00:00:00');
                  if (thisUpdate < border) {
                     expect(parsed.thisupdate).to.match(/\d{12}Z/);
                  }
                  else {
                     this.skip();
                  }
               });
               it('is encoded as GeneralizedTime', function() {
                  let thisUpdate = jsrsasign.zulutodate(parsed.thisupdate);
                  let border = new Date('2050-01-01T00:00:00');
                  if (thisUpdate >= border) {
                     expect(parsed.thisupdate).to.match(/\d{14}Z/);
                  }
                  else {
                     this.skip();
                  }
               });

               /* Where encoded as UTCTime, thisUpdate MUST be specified and
               interpreted as defined in Section 4.1.2.5.1.  Where encoded as
               GeneralizedTime, thisUpdate MUST be specified and interpreted as
               defined in Section 4.1.2.5.2. */
            });
            describe('5.1.2.5. Next Update', function() {
               /* This field indicates the date by which the next CRL will be issued.
               The next CRL could be issued before the indicated date, but it will
               not be issued any later than the indicated date.  CRL issuers SHOULD
               issue CRLs with a nextUpdate time equal to or later than all previous
               CRLs.  nextUpdate may be encoded as UTCTime or GeneralizedTime.

               Conforming CRL issuers MUST include the nextUpdate field in all CRLs.
               Note that the ASN.1 syntax of TBSCertList describes this field as
               OPTIONAL, which is consistent with the ASN.1 structure defined in
               [X.509].  The behavior of clients processing CRLs that omit
               nextUpdate is not specified by this profile. */

               it('is present', function() {
                  let nextUpdate = jsrsasign.zulutodate(parsed.nextupdate);
                  expect(nextUpdate).to.be.a.string;
               });

               /* CRL issuers conforming to this profile MUST encode nextUpdate as
               UTCTime for dates through the year 2049.  CRL issuers conforming to
               this profile MUST encode nextUpdate as GeneralizedTime for dates in
               the year 2050 or later.  Conforming applications MUST be able to
               process dates that are encoded in either UTCTime or GeneralizedTime.

               Where encoded as UTCTime, nextUpdate MUST be specified and
               interpreted as defined in Section 4.1.2.5.1.  Where encoded as
               GeneralizedTime, nextUpdate MUST be specified and interpreted as
               defined in Section 4.1.2.5.2. */

               it('is encoded as UTCTime', function() {
                  let nextUpdate = jsrsasign.zulutodate(parsed.nextupdate);
                  let border = new Date('2050-01-01T00:00:00');
                  if (nextUpdate < border)
                     expect(parsed.nextupdate).to.match(/\d{12}Z/);
                  else
                     this.skip();
               });
               it('is encoded as GeneralizedTime', function() {
                  let nextUpdate = jsrsasign.zulutodate(parsed.nextupdate);
                  let border = new Date('2050-01-01T00:00:00');
                  if (nextUpdate >= border)
                     expect(parsed.nextupdate).to.match(/\d{12}Z/);
                  else
                     this.skip();
               });
            });
            it('has nextUpdate after thisUpdate', function() {
               let nextUpdate = jsrsasign.zulutodate(parsed.nextupdate);
               let thisUpdate = jsrsasign.zulutodate(parsed.thisupdate);
               expect(nextUpdate).afterTime(thisUpdate);
            });
            describe('5.1.2.6. Revoked Certificates', function() {
               /* When there are no revoked certificates, the revoked certificates list
               MUST be absent. */
               it('are present', function() {
                  if (!parsed.revcert)
                     this.skip();
                  else
                     expect(parsed.revcert).to.have.lengthOf.above(0);
               });
               describe('serialNumbers', function() {
                   /* Otherwise, revoked certificates are listed by their
                   serial numbers.  Certificates revoked by the CA are uniquely
                   identified by the certificate serial number. */
                   it('have values not more than 20 octets', function() {
                      if (!parsed.revcert) {
                         this.skip();
                      }
                      else {
                         for (let cert of parsed.revcert) {
                            if (cert.sn.hex.length == 42) {
                               expect(cert.sn.hex[0]).to.be.equal('0');
                               expect(cert.sn.hex[1]).to.be.equal('0');
                               expect(cert.sn.hex[2]).to.be.oneOf(['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
                            }
                            else {
                               expect(cert.sn.hex).to.have.lengthOf.below(42);
                            }
                         }
                      }
                   });
                   it('are positive', function() {
                      if (!parsed.revcert) {
                         this.skip();
                      }
                      else {
                         for (let cert of parsed.revcert) {
                            if (cert.sn.hex.length > 2) {
                               if (cert.sn.hex.startsWith('00'))
                                  expect(cert.sn.hex[2]).to.be.oneOf(['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
                               else
                                  expect(cert.sn.hex[0]).not.to.be.oneOf(['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
                            }
                            else {
                               expect(cert.sn.hex[0]).not.to.be.oneOf(['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
                            }
                         }
                      }
                  });
               });
               /* The date on which the revocation occurred is specified.  The time
               for revocationDate MUST be expressed as described in Section 5.1.2.4.
               Additional information may be supplied in CRL entry extensions; CRL
               entry extensions are discussed in Section 5.3. */
               it('have revocationDate', function() {
                  if (!parsed.revcert) {
                     this.skip();
                  }
                  else {
                     let thisUpdate = jsrsasign.zulutodate(parsed.thisupdate);
                     for (let cert of parsed.revcert) {
                        let revocationDate = jsrsasign.zulutodate(cert.date);
                        expect(revocationDate).beforeOrEqualTime(thisUpdate);
                     }
                  }
               });
               it('have revocationDate encoded properly', function() {
                  if (!parsed.revcert) {
                     this.skip();
                  }
                  else {
                     for (let cert of parsed.revcert) {
                        let revdate = jsrsasign.zulutodate(cert.date);
                        let border = new Date('2050-01-01T00:00:00');
                        if (revdate < border)
                            expect(cert.date).to.match(/\d{12}Z/);
                        else
                            expect(cert.date).to.match(/\d{14}Z/);
                     }
                  }
               });
            });
            describe('5.1.2.7. Extensions', function() {
               /* This field may only appear if the version is 2 (Section 5.1.2.1).  If
               present, this field is a sequence of one or more CRL extensions.  CRL
               extensions are discussed in Section 5.2. */
               it('are present', function() {
                  if (!parsed.ext)
                     this.skip();
                  else
                     expect(parsed.ext).not.to.be.null;
               });
               it('are not empty', function() {
                  if (!parsed.ext)
                     this.skip();
                  else
                     expect(parsed.ext).to.have.lengthOf.above(0);
               });
            });
         });
      });
      describe('5.2. CRL Extensions', function() {
         /* The extensions defined by ANSI X9, ISO/IEC, and ITU-T for X.509 v2
         CRLs [X.509] [X9.55] provide methods for associating additional
         attributes with CRLs.  The X.509 v2 CRL format also allows
         communities to define private extensions to carry information unique
         to those communities.  Each extension in a CRL may be designated as
         critical or non-critical.  If a CRL contains a critical extension
         that the application cannot process, then the application MUST NOT
         use that CRL to determine the status of certificates.  However,
         applications may ignore unrecognized non-critical extensions. The
         following subsections present those extensions used within Internet
         CRLs.  Communities may elect to include extensions in CRLs that are
         not defined in this specification.  However, caution should be
         exercised in adopting any critical extensions in CRLs that might be
         used in a general context. */
         it('are known or non-critical', function() {
            if (!parsed.ext) {
               this.skip();
            }
            else {
               for (let ext of parsed.ext) {
                  if (ext.critical === true) {
                     expect(ext.extname).to.be.oneOf([
                        '2.5.29.35', 'authorityKeyIdentifier',
                        '2.5.29.18', 'issuerAlternativeName',
                        '2.5.29.20', 'crlNumber',
                        '2.5.29.27', 'deltaCRLIndicator',
                        '2.5.29.46', 'deltaCRLDistributionPoint',
                        '2.5.29.28', 'issuingDistributionPoint',
                        '1.3.6.1.5.5.7.1.1', 'authorityInfoAccess'
                     ]);
                  }
               }
            }
         });

         /* Conforming CRL issuers are REQUIRED to include the authority key
         identifier (Section 5.2.1) and the CRL number (Section 5.2.3)
         extensions in all CRLs issued. */

         describe('5.2.1. Authority Key Identifier', function() {
            /* The authority key identifier extension provides a means of
            identifying the public key corresponding to the private key used to
            sign a CRL.  The identification can be based on either the key
            identifier (the subject key identifier in the CRL signer's
            certificate) or the issuer name and serial number.  This extension is
            especially useful where an issuer has more than one signing key,
            either due to multiple concurrent key pairs or due to changeover.

            Conforming CRL issuers MUST use the key identifier method, and MUST
            include this extension in all CRLs issued.

            The syntax for this CRL extension is defined in Section 4.2.1.1. */
            it('is included', function() {
               let aki = parsed.ext.find(ext => ext.extname === 'authorityKeyIdentifier');
               expect(aki).not.to.be.undefined;
            });
            it('uses subject key identifier', function() {
               let aki = parsed.ext.find(ext => ext.extname === 'authorityKeyIdentifier');
               if (aki.issuer === undefined && aki.serial === undefined)
                  expect(aki.kid).not.to.be.undefined;
               else
                  this.skip();
            });
            it('uses issuer name and serial', function() {
               let aki = parsed.ext.find(ext => ext.extname === 'authorityKeyIdentifier');
               if (aki.kid === undefined) {
                  expect(aki.issuer).not.to.be.undefined;
                  expect(aki.serial).not.to.be.undefined;
               }
               else {
                  this.skip();
               }
            });
         });

         describe('5.2.2. Issuer Alternative Name', function() {
            /* The issuer alternative name extension allows additional identities to
            be associated with the issuer of the CRL.  Defined options include an
            electronic mail address (rfc822Name), a DNS name, an IP address, and
            a URI.  Multiple instances of a name form and multiple name forms may
            be included.  Whenever such identities are used, the issuer
            alternative name extension MUST be used; however, a DNS name MAY be
            represented in the issuer field using the domainComponent attribute
            as described in Section 4.1.2.4.
         
            Conforming CRL issuers SHOULD mark the issuerAltName extension as
            non-critical. */
            it('is non-critical', function() {
               let ian = parsed.ext.find(ext => ext.extname === 'issuerAlternativeName');
               if (ian !== undefined) {
                  if (ian.critial)
                     expect(ian.critical).to.be.false;
               }
               else {
                  this.skip();
               }
            });
            /* The OID and syntax for this CRL extension are defined in Section
            4.2.1.7. */
         });
         describe('5.2.3. CRL Number', function() {
            /* The CRL number is a non-critical CRL extension that conveys a
            monotonically increasing sequence number for a given CRL scope and
            CRL issuer.  This extension allows users to easily determine when a
            particular CRL supersedes another CRL.  CRL numbers also support the
            identification of complementary complete CRLs and delta CRLs.  CRL
            issuers conforming to this profile MUST include this extension in all
            CRLs and MUST mark this extension as non-critical.

            If a CRL issuer generates delta CRLs in addition to complete CRLs for
            a given scope, the complete CRLs and delta CRLs MUST share one
            numbering sequence.  If a delta CRL and a complete CRL that cover the
            same scope are issued at the same time, they MUST have the same CRL
            number and provide the same revocation information.  That is, the
            combination of the delta CRL and an acceptable complete CRL MUST
            provide the same revocation information as the simultaneously issued
            complete CRL. */

            it('is included', function() {
               let csn = parsed.ext.find(ext => ext.extname === 'cRLNumber');
               expect(csn).not.to.be.undefined;
            });

            it('is non-critical', function() {
               let csn = parsed.ext.find(ext => ext.extname === 'cRLNumber');
               if (csn.critical)
                  expect(csn.critical).to.be.false;
            });

            /* If a CRL issuer generates two CRLs (two complete CRLs, two delta
            CRLs, or a complete CRL and a delta CRL) for the same scope at
            different times, the two CRLs MUST NOT have the same CRL number.
            That is, if the this update field (Section 5.1.2.4) in the two CRLs
            are not identical, the CRL numbers MUST be different.

            Given the requirements above, CRL numbers can be expected to contain
            long integers.  CRL verifiers MUST be able to handle CRLNumber values
            up to 20 octets.  Conforming CRL issuers MUST NOT use CRLNumber
            values longer than 20 octets. */

            it('has a value not more than 20 octets', function() {
               let csn = parsed.ext.find(ext => ext.extname === 'cRLNumber');
               if (csn.num.hex.length === 42) {
                  expect(csn.num.hex[0]).to.be.equal('0');
                  expect(csn.num.hex[1]).to.be.equal('0');
                  expect(csn.num.hex[2]).to.be.oneOf(['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
               }
               else if (csn.num.hex.lenth === 40) {
                  expect(csn.num.hex[0]).not.to.be.oneOf(['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
               }
               else {
                  expect(csn.num.hex).to.have.lengthOf.below(42);
               }
            });

            /* id-ce-cRLNumber OBJECT IDENTIFIER ::= { id-ce 20 }

            CRLNumber ::= INTEGER (0..MAX) */
         });
         describe('5.2.4. Delta CRL Indicator', function() {
            /* The delta CRL indicator is a critical CRL extension that identifies a
            CRL as being a delta CRL.  Delta CRLs contain updates to revocation
            information previously distributed, rather than all the information
            that would appear in a complete CRL.  The use of delta CRLs can
            significantly reduce network load and processing time in some
            environments.  Delta CRLs are generally smaller than the CRLs they
            update, so applications that obtain delta CRLs consume less network
            bandwidth than applications that obtain the corresponding complete
            CRLs.  Applications that store revocation information in a format
            other than the CRL structure can add new revocation information to
            the local database without reprocessing information.

            The delta CRL indicator extension contains the single value of type
            BaseCRLNumber.  The CRL number identifies the CRL, complete for a
            given scope, that was used as the starting point in the generation of
            this delta CRL.  A conforming CRL issuer MUST publish the referenced
            base CRL as a complete CRL.  The delta CRL contains all updates to
            the revocation status for that same scope.  The combination of a
            delta CRL plus the referenced base CRL is equivalent to a complete
            CRL, for the applicable scope, at the time of publication of the
            delta CRL.

            When a conforming CRL issuer generates a delta CRL, the delta CRL
            MUST include a critical delta CRL indicator extension. */

            it('is critical', function() {
               let dci = parsed.ext.find(ext => ext.extname === 'deltaCRLIndicator');
               if (dci !== undefined) {
                  if (dci.critical)
                     expect(dci.critical).to.be.true;
               }
               else {
                  this.skip();
               }
            });
 
            /* When a delta CRL is issued, it MUST cover the same set of reasons and
            the same set of certificates that were covered by the base CRL it
            references.  That is, the scope of the delta CRL MUST be the same as
            the scope of the complete CRL referenced as the base.  The referenced
            base CRL and the delta CRL MUST omit the issuing distribution point
            extension or contain identical issuing distribution point extensions.
            Further, the CRL issuer MUST use the same private key to sign the
            delta CRL and any complete CRL that it can be used to update.

            An application that supports delta CRLs can construct a CRL that is
            complete for a given scope by combining a delta CRL for that scope
            with either an issued CRL that is complete for that scope or a
            locally constructed CRL that is complete for that scope.

            When a delta CRL is combined with a complete CRL or a locally
            constructed CRL, the resulting locally constructed CRL has the CRL
            number specified in the CRL number extension found in the delta CRL
            used in its construction.  In addition, the resulting locally
            constructed CRL has the thisUpdate and nextUpdate times specified in
            the corresponding fields of the delta CRL used in its construction.
            In addition, the locally constructed CRL inherits the issuing
            distribution point from the delta CRL.

            A complete CRL and a delta CRL MAY be combined if the following four
            conditions are satisfied:

               (a)  The complete CRL and delta CRL have the same issuer.

               (b)  The complete CRL and delta CRL have the same scope.  The two
                    CRLs have the same scope if either of the following
                    conditions are met:

                  (1)  The issuingDistributionPoint extension is omitted from
                       both the complete CRL and the delta CRL.

                  (2)  The issuingDistributionPoint extension is present in both
                       the complete CRL and the delta CRL, and the values for
                       each of the fields in the extensions are the same in both
                       CRLs.

               (c)  The CRL number of the complete CRL is equal to or greater
                    than the BaseCRLNumber specified in the delta CRL.  That is,
                    the complete CRL contains (at a minimum) all the revocation
                    information held by the referenced base CRL.

               (d)  The CRL number of the complete CRL is less than the CRL
                    number of the delta CRL.  That is, the delta CRL follows the
                    complete CRL in the numbering sequence.

            CRL issuers MUST ensure that the combination of a delta CRL and any
            appropriate complete CRL accurately reflects the current revocation
            status.  The CRL issuer MUST include an entry in the delta CRL for
            each certificate within the scope of the delta CRL whose status has
            changed since the generation of the referenced base CRL:

               (a)  If the certificate is revoked for a reason included in the
                    scope of the CRL, list the certificate as revoked.

               (b)  If the certificate is valid and was listed on the referenced
                    base CRL or any subsequent CRL with reason code
                    certificateHold, and the reason code certificateHold is
                    included in the scope of the CRL, list the certificate with
                    the reason code removeFromCRL.

               (c)  If the certificate is revoked for a reason outside the scope
                    of the CRL, but the certificate was listed on the referenced
                    base CRL or any subsequent CRL with a reason code included in
                    the scope of this CRL, list the certificate as revoked but
                    omit the reason code.

               (d)  If the certificate is revoked for a reason outside the scope
                    of the CRL and the certificate was neither listed on the
                    referenced base CRL nor any subsequent CRL with a reason code
                    included in the scope of this CRL, do not list the
                    certificate on this CRL.

            The status of a certificate is considered to have changed if it is
            revoked (for any revocation reason, including certificateHold), if it
            is released from hold, or if its revocation reason changes.

            It is appropriate to list a certificate with reason code
            removeFromCRL on a delta CRL even if the certificate was not on hold
            in the referenced base CRL.  If the certificate was placed on hold in
            any CRL issued after the base but before this delta CRL and then
            released from hold, it MUST be listed on the delta CRL with
            revocation reason removeFromCRL.

            A CRL issuer MAY optionally list a certificate on a delta CRL with
            reason code removeFromCRL if the notAfter time specified in the
            certificate precedes the thisUpdate time specified in the delta CRL
            and the certificate was listed on the referenced base CRL or in any
            CRL issued after the base but before this delta CRL.

            If a certificate revocation notice first appears on a delta CRL, then
            it is possible for the certificate validity period to expire before
            the next complete CRL for the same scope is issued.  In this case,
            the revocation notice MUST be included in all subsequent delta CRLs
            until the revocation notice is included on at least one explicitly
            issued complete CRL for this scope.

            An application that supports delta CRLs MUST be able to construct a
            current complete CRL by combining a previously issued complete CRL
            and the most current delta CRL.  An application that supports delta
            CRLs MAY also be able to construct a current complete CRL by
            combining a previously locally constructed complete CRL and the
            current delta CRL.  A delta CRL is considered to be the current one
            if the current time is between the times contained in the thisUpdate
            and nextUpdate fields.  Under some circumstances, the CRL issuer may
            publish one or more delta CRLs before the time indicated by the
            nextUpdate field.  If more than one current delta CRL for a given
            scope is encountered, the application SHOULD consider the one with
            the latest value in thisUpdate to be the most current one.

            id-ce-deltaCRLIndicator OBJECT IDENTIFIER ::= { id-ce 27 }

                     BaseCRLNumber ::= CRLNumber */

         });
         describe('5.2.5. Issuing Distribution Point', function() {
            /* The issuing distribution point is a critical CRL extension that
            identifies the CRL distribution point and scope for a particular CRL,
            and it indicates whether the CRL covers revocation for end entity
            certificates only, CA certificates only, attribute certificates only,
            or a limited set of reason codes.  Although the extension is
            critical, conforming implementations are not required to support this
            extension.  However, implementations that do not support this
            extension MUST either treat the status of any certificate not listed
            on this CRL as unknown or locate another CRL that does not contain
            any unrecognized critical extensions. */

            it('is critical', function() {
               let idp = parsed.ext.find(ext => ext.extname === '2.5.29.28');
               if (idp !== undefined)
                  expect(idp.critical).to.be.true;
               else
                  this.skip();
            });

            /* The CRL is signed using the CRL issuer's private key.  CRL
            distribution points do not have their own key pairs.  If the CRL is
            stored in the X.500 directory, it is stored in the directory entry
            corresponding to the CRL distribution point, which may be different
            from the directory entry of the CRL issuer.

            The reason codes associated with a distribution point MUST be
            specified in onlySomeReasons.  If onlySomeReasons does not appear,
            the distribution point MUST contain revocations for all reason codes.
            CAs may use CRL distribution points to partition the CRL on the basis
            of compromise and routine revocation.  In this case, the revocations
            with reason code keyCompromise (1), cACompromise (2), and
            aACompromise (8) appear in one distribution point, and the
            revocations with other reason codes appear in another distribution
            point.

            If a CRL includes an issuingDistributionPoint extension with
            onlySomeReasons present, then every certificate in the scope of the
            CRL that is revoked MUST be assigned a revocation reason other than
            unspecified.  The assigned revocation reason is used to determine on
            which CRL(s) to list the revoked certificate, however, there is no
            requirement to include the reasonCode CRL entry extension in the
            corresponding CRL entry.

            The syntax and semantics for the distributionPoint field are the same
            as for the distributionPoint field in the cRLDistributionPoints
            extension (Section 4.2.1.13).  If the distributionPoint field is
            present, then it MUST include at least one of names from the
            corresponding distributionPoint field of the cRLDistributionPoints
            extension of every certificate that is within the scope of this CRL.
            The identical encoding MUST be used in the distributionPoint fields
            of the certificate and the CRL.

            If the distributionPoint field is absent, the CRL MUST contain
            entries for all revoked unexpired certificates issued by the CRL
            issuer, if any, within the scope of the CRL.

            If the scope of the CRL only includes certificates issued by the CRL
            issuer, then the indirectCRL boolean MUST be set to FALSE.
            Otherwise, if the scope of the CRL includes certificates issued by
            one or more authorities other than the CRL issuer, the indirectCRL
            boolean MUST be set to TRUE.  The authority responsible for each
            entry is indicated by the certificate issuer CRL entry extension
            (Section 5.3.3).

            If the scope of the CRL only includes end entity public key
            certificates, then onlyContainsUserCerts MUST be set to TRUE.  If the
            scope of the CRL only includes CA certificates, then
            onlyContainsCACerts MUST be set to TRUE.  If either
            onlyContainsUserCerts or onlyContainsCACerts is set to TRUE, then the
            scope of the CRL MUST NOT include any version 1 or version 2
            certificates.  Conforming CRLs issuers MUST set the
            onlyContainsAttributeCerts boolean to FALSE.

            Conforming CRLs issuers MUST NOT issue CRLs where the DER encoding of
            the issuing distribution point extension is an empty sequence.  That
            is, if onlyContainsUserCerts, onlyContainsCACerts, indirectCRL, and
            onlyContainsAttributeCerts are all FALSE, then either the
            distributionPoint field or the onlySomeReasons field MUST be present.

            id-ce-issuingDistributionPoint OBJECT IDENTIFIER ::= { id-ce 28 }

            IssuingDistributionPoint ::= SEQUENCE {
                 distributionPoint          [0] DistributionPointName OPTIONAL,
                 onlyContainsUserCerts      [1] BOOLEAN DEFAULT FALSE,
                 onlyContainsCACerts        [2] BOOLEAN DEFAULT FALSE,
                 onlySomeReasons            [3] ReasonFlags OPTIONAL,
                 indirectCRL                [4] BOOLEAN DEFAULT FALSE,
                 onlyContainsAttributeCerts [5] BOOLEAN DEFAULT FALSE }

                 -- at most one of onlyContainsUserCerts, onlyContainsCACerts,
                 -- and onlyContainsAttributeCerts may be set to TRUE. */
         });
         describe('5.2.6. Freshest CRL (a.k.a. Delta CRL Distribution Point)', function() {
            /* The freshest CRL extension identifies how delta CRL information for
            this complete CRL is obtained.  Conforming CRL issuers MUST mark this
            extension as non-critical. */
            it('is non-critical', function() {
               let dcdp = parsed.ext.find(ext => ext.extname === '2.5.29.46');
               if (dcdp !== undefined) {
                  if (dcdp.critial)
                     expect(dcdp.critical).to.be.false;
               }
               else {
                  this.skip();
               }
            });
            /* This extension MUST NOT appear in delta CRLs. */
            it('appears not in a delta CRL', function() { 
               if (parsed.ext) {
                  let dcdp = parsed.ext.find(ext => ext.extname === '2.5.29.46');
                  if (dcdp !== undefined)
                     expect(parsed.ext.find(ext => ext.extname === 'deltaCRLIndicator')).to.be.undefined;
               }
               else {
                  this.skip();
               }
            });
            /* The same syntax is used for this extension as the
            cRLDistributionPoints certificate extension, and is described in
            Section 4.2.1.13.  However, only the distribution point field is
            meaningful in this context.  The reasons and cRLIssuer fields MUST be
            omitted from this CRL extension.

            Each distribution point name provides the location at which a delta
            CRL for this complete CRL can be found.  The scope of these delta
            CRLs MUST be the same as the scope of this complete CRL.  The
            contents of this CRL extension are only used to locate delta CRLs;
            the contents are not used to validate the CRL or the referenced delta
            CRLs.  The encoding conventions defined for distribution points in
            Section 4.2.1.13 apply to this extension.

            id-ce-freshestCRL OBJECT IDENTIFIER ::=  { id-ce 46 }

            FreshestCRL ::= CRLDistributionPoints */

            it('is accessible', function(done) {
               if (!phoneOut) {
                  this.skip();
               }
               else {
                  let dcdp = parsed.ext.find(ext => ext.extname === '2.5.29.46');
                  if (dcdp !== undefined) {
                     let buf = Buffer.from(dcdp.extn.substring(20), 'hex');
                     let uri = new url.URL(buf.toString());
                     if (uri.protocol === 'http:') {
                        chai.request(uri.protocol + '//' + uri.hostname).get(uri.pathname)
                           .buffer()
                           .parse(binaryParser)
                           .end(function(err, res) {
                              expect(err).to.be.null;
                              expect(res).to.have.status(200);
                              expect(res).to.have.header('content-type', 'application/pkix-crl');
                              expect(res.body).to.be.an.instanceof(Buffer);
                              done();
                           });
                     }
                     else {
                        this.skip();
                     }
                  }
                  else {
                     this.skip();
                  }
               }
            });
         });
         describe('5.2.7. Authority Information Access', function() {
            /* This section defines the use of the Authority Information Access
            extension in a CRL.  The syntax and semantics defined in Section
            4.2.2.1 for the certificate extension are also used for the CRL
            extension.

            This CRL extension MUST be marked as non-critical. */
            it('is non-critical', function() {
               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  if (aia.critial)
                     expect(aia.critical).to.be.false;
               }
               else {
                  this.skip();
               }
            });
 
            /* When present in a CRL, this extension MUST include at least one
            AccessDescription specifying id-ad-caIssuers as the accessMethod.
            The id-ad-caIssuers OID is used when the information available lists
            certificates that can be used to verify the signature on the CRL
            (i.e., certificates that have a subject name that matches the issuer
            name on the CRL and that have a subject public key that corresponds
            to the private key used to sign the CRL). */
            it('has id-ad-caIssuers', function() {
               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  let caIssuer = aia.array.find(entry => entry.caissuer);
                  expect(caIssuer).not.to.be.undefined;
               }
               else {
                  this.skip();
               }
            });
            /* Access method types other than id-ad-caIssuers MUST NOT be included. */
            it('has only id-ad-caIssuers', function() {
               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  for (let entry of aia.array) {
                     expect(entry.caissuer).not.to.be.undefined;
                  }
               }
               else {
                  this.skip();
               }
            });
            /* At least one instance of AccessDescription SHOULD specify an
            accessLocation that is an HTTP [RFC2616] or LDAP [RFC4516] URI. */
            it('has an HTTP or LDAP URI', function() {
               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  for (let entry of aia.array) {
                     expect(entry.caissuer.substring(0, 4)).to.be.oneOf(['http', 'ldap']);
                  }
               }
               else {
                  this.skip();
               }
            });
            /* Where the information is available via HTTP or FTP, accessLocation
            MUST be a uniformResourceIdentifier and the URI MUST point to either
            a single DER encoded certificate as specified in [RFC2585] or a
            collection of certificates in a BER or DER encoded "certs-only" CMS
            message as specified in [RFC2797]. */

            it('is accessible', function(done) {
               if (!phoneOut)
                  this.skip();

               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  for (let entry of aia.array) {
                     let uri = new url.URL(entry.caissuer);
                     chai.request(uri.protocol + '//' + uri.hostname).get(uri.pathname)
                        .buffer()
                        .parse(binaryParser)
                        .end(function(err, res) {
                           expect(err).to.be.null;
                           // console.log(JSON.stringify(res));
                           expect(res).to.have.status(200);
                           expect(res).to.have.header('content-type', 'application/pkix-cert');
                           expect(res.body).to.be.an.instanceof(Buffer);
                           done();
                       });
                  }
               }
               else {
                  this.skip();
               }
            });

            /* Conforming applications that support HTTP or FTP for accessing
            certificates MUST be able to accept individual DER encoded
            certificates and SHOULD be able to accept "certs-only" CMS messages.

            HTTP server implementations accessed via the URI SHOULD specify the
            media type application/pkix-cert [RFC2585] in the content-type header
            field of the response for a single DER encoded certificate and SHOULD
            specify the media type application/pkcs7-mime [RFC2797] in the
            content-type header field of the response for "certs-only" CMS
            messages.  For FTP, the name of a file that contains a single DER
            encoded certificate SHOULD have a suffix of ".cer" [RFC2585] and the
            name of a file that contains a "certs-only" CMS message SHOULD have a
            suffix of ".p7c" [RFC2797].  Consuming clients may use the media type
            or file extension as a hint to the content, but should not depend
            solely on the presence of the correct media type or file extension in
            the server response. */

            it('have correct file suffixes', function() {
               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  for (let entry of aia.array) {
                     let uri = new url.URL(entry.caissuer);
                     if (uri.protocol === 'ftp:') {
                         let extension = uri.pathname.substring(uri.pathname.length - 4);
                         expect(extension).to.be.oneOf(['.cer', '.p7c']);
                     }
                  }
               }
               else {
                  this.skip();
               }
            });

            /* When the accessLocation is a directoryName, the information is to be
            obtained by the application from whatever directory server is locally
            configured.  When one CA public key is used to validate signatures on
            certificates and CRLs, the desired CA certificate is stored in the
            crossCertificatePair and/or cACertificate attributes as specified in
            [RFC4523].  When different public keys are used to validate
            signatures on certificates and CRLs, the desired certificate is
            stored in the userCertificate attribute as specified in [RFC4523].
            Thus, implementations that support the directoryName form of
            accessLocation MUST be prepared to find the needed certificate in any
            of these three attributes.  The protocol that an application uses to
            access the directory (e.g., DAP or LDAP) is a local matter.

            Where the information is available via LDAP, the accessLocation
            SHOULD be a uniformResourceIdentifier.  The LDAP URI [RFC4516] MUST
            include a <dn> field containing the distinguished name of the entry
            holding the certificates, MUST include an <attributes> field that
            lists appropriate attribute descriptions for the attributes that hold
            the DER encoded certificates or cross-certificate pairs [RFC4523],
            and SHOULD include a <host> (e.g., <ldap://ldap.example.com/cn=CA,
            dc=example,dc=com?cACertificate;binary,crossCertificatePair;binary>).
            Omitting the <host> (e.g., <ldap:///cn=exampleCA,dc=example,dc=com?
            cACertificate;binary>) has the effect of relying on whatever a priori
            knowledge the client might have to contact an appropriate server. */
         });
      });
      describe('5.3. CRL Entry Extensions', function() {
         /* The CRL entry extensions defined by ISO/IEC, ITU-T, and ANSI X9 for
         X.509 v2 CRLs provide methods for associating additional attributes
         with CRL entries [X.509] [X9.55].  The X.509 v2 CRL format also
         allows communities to define private CRL entry extensions to carry
         information unique to those communities.  Each extension in a CRL
         entry may be designated as critical or non-critical.  If a CRL
         contains a critical CRL entry extension that the application cannot
         process, then the application MUST NOT use that CRL to determine the
         status of any certificates.  However, applications may ignore
         unrecognized non-critical CRL entry extensions.

         The following subsections present recommended extensions used within
         Internet CRL entries and standard locations for information.
         Communities may elect to use additional CRL entry extensions;
         however, caution should be exercised in adopting any critical CRL
         entry extensions in CRLs that might be used in a general context.

         Support for the CRL entry extensions defined in this specification is
         optional for conforming CRL issuers and applications.  However, CRL
         issuers SHOULD include reason codes (Section 5.3.1) and invalidity
         dates (Section 5.3.2) whenever this information is available. */
         describe('5.3.1. Reason Code', function() {
            /* The reasonCode is a non-critical CRL entry extension that identifies
            the reason for the certificate revocation. */
            it('is non-critical', function() {
               let aia = parsed.ext.find(ext => ext.extname === 'authorityInfoAccess');
               if (aia !== undefined) {
                  if (aia.critial)
                     expect(aia.critical).to.be.false;
               }
               else {
                  this.skip();
               }
            });
            /* CRL issuers are strongly encouraged to include meaningful reason
            codes in CRL entries; however, the reason code CRL entry extension
            SHOULD be absent instead of using the unspecified (0) reasonCode value. */
            describe('unspecified', function() {
               it('is absent', function() {
                  if (parsed.revcert) {
                     let withReasons = parsed.revcert.filter(cert => cert.reason === 'unspecified');
                     expect(withReasons).to.have.lengthOf(0);
                  }
                  else {
                     this.skip();
                  }
               });
            });
            /* The removeFromCRL (8) reasonCode value may only appear in delta CRLs
            and indicates that a certificate is to be removed from a CRL because
            either the certificate expired or was removed from hold. */
            describe('removeFromCRL', function() {
               it('is only used in a delta CRL', function() {
                  if (parsed.revcert) {
                     if (parsed.ext.some(ext => ext.extname === 'deltaCRLIndicator')) {
                        let withReasons = parsed.revcert.filter(cert => cert.reason === 'removeFromCRL');
                        expect(withReasons).to.have.lengthOf(0);
                     }
                  }
                  else {
                     this.skip();
                  }
               });
            });
            /* All other reason codes may appear in any CRL and indicate that the
            specified certificate should be considered revoked.

            id-ce-cRLReasons OBJECT IDENTIFIER ::= { id-ce 21 }

            -- reasonCode ::= { CRLReason }

            CRLReason ::= ENUMERATED {
                 unspecified             (0),
                 keyCompromise           (1),
                 cACompromise            (2),
                 affiliationChanged      (3),
                 superseded              (4),
                 cessationOfOperation    (5),
                 certificateHold         (6),
                      -- value 7 is not used
                 removeFromCRL           (8),
                 privilegeWithdrawn      (9),
                 aACompromise           (10) } */
         });
         describe('5.3.2. Invalidity Date', function() {
            /* The invalidity date is a non-critical CRL entry extension that
            provides the date on which it is known or suspected that the private
            key was compromised or that the certificate otherwise became invalid.
            This date may be earlier than the revocation date in the CRL entry,
            which is the date at which the CA processed the revocation.  When a
            revocation is first posted by a CRL issuer in a CRL, the invalidity
            date may precede the date of issue of earlier CRLs, but the
            revocation date SHOULD NOT precede the date of issue of earlier CRLs.
            Whenever this information is available, CRL issuers are strongly
            encouraged to share it with CRL users. */

            it('is non-critical', function() {
               let found = false;
               if (parsed.revcert) {
                  for (let cert of parsed.revcert) {
                     if (cert.ext) {
                        for (let ext of cert.ext) {
                           if (ext.extname === 'invalidityDate' && ext.critical) {
                              found = true;
                              expect(ext.critical).to.be.true;
                           }
                        }
                     }
                  }
                  if (!found)
                     this.skip();
               }
               else {
                  this.skip();
               }
            });
 
            /* The GeneralizedTime values included in this field MUST be expressed
            in Greenwich Mean Time (Zulu), and MUST be specified and interpreted
            as defined in Section 4.1.2.5.2.

            id-ce-invalidityDate OBJECT IDENTIFIER ::= { id-ce 24 }

            InvalidityDate ::=  GeneralizedTime */
            it('is encoded as GeneralizedTime', function() {
               let found = false;
               if (parsed.revcert) {
                  for (let cert of parsed.revcert) {
                     if (cert.ext) {
                        for (let ext of cert.ext) {
                           if (ext.extname === 'invalidityDate') {
                              found = true;
                              let id = jsrsasign.zulutodate(ext.value);
                              expect(id).not.to.be.undefined;
                              expect(ext.value).to.match(/\d{12}Z/);
                           }
                        }
                     }
                  }
                  if (!found)
                     this.skip();
               } 
               else {
                  this.skip();
               }
            });
         });
         describe('5.3.3. Certificate Issuer', function() {
            /* This CRL entry extension identifies the certificate issuer associated
            with an entry in an indirect CRL, that is, a CRL that has the
            indirectCRL indicator set in its issuing distribution point
            extension.  When present, the certificate issuer CRL entry extension
            includes one or more names from the issuer field and/or issuer
            alternative name extension of the certificate that corresponds to the
            CRL entry.  If this extension is not present on the first entry in an
            indirect CRL, the certificate issuer defaults to the CRL issuer.  On
            subsequent entries in an indirect CRL, if this extension is not
            present, the certificate issuer for the entry is the same as that for
            the preceding entry.  This field is defined as follows:

            id-ce-certificateIssuer   OBJECT IDENTIFIER ::= { id-ce 29 }

            CertificateIssuer ::=     GeneralNames

            Conforming CRL issuers MUST include in this extension the
            distinguished name (DN) from the issuer field of the certificate that
            corresponds to this CRL entry.  The encoding of the DN MUST be
            identical to the encoding used in the certificate.

            CRL issuers MUST mark this extension as critical since an
            implementation that ignored this extension could not correctly
            attribute CRL entries to certificates.  This specification RECOMMENDS
            that implementations recognize this extension. */

            it('is critical', function() {
               let found = false;
               if (parsed.revcert) {
                  for (let cert of parsed.revcert) {
                     if (cert.ext) {
                        for (let ext of cert.ext) {
                           found = true;
                           if (ext.extname === 'certificateIssuer')
                              expect(ext.critical).to.be.true;
                        }
                     }
                  }
                  if (!found)
                     this.skip();
               } 
               else {
                  this.skip();
               }
            });
         });
      });
   });
});
