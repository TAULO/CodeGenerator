System.register(["./ManifestLoaderBase", "../Extension", "../ExtensionNameGenerator"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        }
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var ManifestLoaderBase_1, Extension_1, ExtensionNameGenerator_1, ExtensionLoadError, ExtensionFailureReason, ControlsLoader;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ManifestLoaderBase_1_1) {
                ManifestLoaderBase_1 = ManifestLoaderBase_1_1;
            },
            function (Extension_1_1) {
                Extension_1 = Extension_1_1;
            },
            function (ExtensionNameGenerator_1_1) {
                ExtensionNameGenerator_1 = ExtensionNameGenerator_1_1;
            }
        ],
        execute: function () {
            ExtensionLoadError = Commerce.Extensibility.ExtensionLoadError;
            ExtensionFailureReason = Commerce.Extensibility.ExtensionFailureReason;
            ControlsLoader = (function (_super) {
                __extends(ControlsLoader, _super);
                function ControlsLoader(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._createAndInsertHtmlImpl = createAndInsertHtmlImpl;
                    _this._renderHtmlImpl = renderHtmlImpl;
                    return _this;
                }
                ControlsLoader.prototype.load = function (extensionPackage, controls) {
                    var _this = this;
                    controls = Commerce.ObjectExtensions.isNullOrUndefined(controls) ? [] : controls;
                    var loadSequence = Promise.resolve();
                    controls.forEach(function (controlManifestItem) {
                        var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                        var controlManifestString = JSON.stringify(controlManifestItem);
                        Commerce.RetailLogger.extensibilityFrameworkControlsStarted(controlManifestString, correlationId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        loadSequence = loadSequence.then(function () {
                            var extensionPointName = "Control";
                            var extensionPointType;
                            var extensionName = ExtensionNameGenerator_1.default.getControlExtensionName(controlManifestItem);
                            return Promise.resolve()
                                .then(function () {
                                if (Commerce.StringExtensions.isNullOrWhitespace(controlManifestItem.htmlPath)) {
                                    Commerce.RetailLogger.extensibilityFrameworkControlsOneOftheRequiredParametersMissing(controlManifestString, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    var extensionLoaderError = new ExtensionLoadError(ExtensionFailureReason.HtmlPathNullOrWhitespace);
                                    return Promise.reject(extensionLoaderError);
                                }
                                else {
                                    return Promise.resolve();
                                }
                            }).then(function () {
                                return _this._loadControlHtmlFragment(extensionPackage, controlManifestItem);
                            }).then(function () {
                                return _this._loadControlModule(extensionPackage, controlManifestItem);
                            }).then(function () {
                                Commerce.RetailLogger.extensibilityFrameworkControlsFinished(correlationId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName);
                                extensionPackage.addExtension(extension);
                            }, function (reason) {
                                var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                                var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, loadError);
                                extensionPackage.addExtension(extension);
                            });
                        });
                    });
                    return loadSequence;
                };
                ControlsLoader.prototype._loadControlHtmlFragment = function (extensionPackage, controlManifestItem) {
                    var htmlFragmentPath = extensionPackage.packageInfo.baseUrl + "/" + controlManifestItem.htmlPath;
                    var fragmentWrapper = this._createAndInsertHtmlImpl(encodeURIComponent(htmlFragmentPath));
                    if (Commerce.ObjectExtensions.isNullOrUndefined(fragmentWrapper)) {
                        var errorMessage = "Unable to create and insert html for extension control.";
                        Commerce.RetailLogger.extensibilityFrameworkUnableToCreateAndInsertHtmlFragmentForControl(errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        throw new Error(errorMessage);
                    }
                    var renderHtmlPromise = this._renderHtmlImpl(htmlFragmentPath, fragmentWrapper).catch(function (error) {
                        fragmentWrapper.parentNode.removeChild(fragmentWrapper);
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlFailedToRenderHtmlFragment(Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    });
                    return renderHtmlPromise.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlHtmlFragment(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                ControlsLoader.prototype._loadControlModule = function (extensionPackage, controlManifestItem) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(controlManifestItem.modulePath)) {
                        return Promise.resolve();
                    }
                    else {
                        return this.loadModule(extensionPackage.packageInfo.baseUrl, controlManifestItem.modulePath)
                            .then(function (controlType) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(controlType)) {
                                try {
                                    new controlType.default(extensionPackage.context);
                                    return Promise.resolve();
                                }
                                catch (ex) {
                                    Commerce.RetailLogger.extensibilityFrameworkControlsUnableToInitializeControlModule(Commerce.ErrorHelper.serializeError(ex), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.reject(ex);
                                }
                            }
                            else {
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToInitializeControlModule(JSON.stringify(controlManifestItem.modulePath), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var loadError = new Error("Unable to initialize control module.");
                                return Promise.reject(loadError);
                            }
                        }).catch(function (reason) {
                            Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlModule(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(reason);
                        });
                    }
                };
                return ControlsLoader;
            }(ManifestLoaderBase_1.default));
            exports_1("default", ControlsLoader);
        }
    };
});
//# sourceMappingURL=ControlsLoader.js.map
// SIG // Begin signature block
// SIG // MIIjpgYJKoZIhvcNAQcCoIIjlzCCI5MCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // z10cY7YjuEkztp/7XDrGByxRx3Xq296PqfDuCwPMr6ig
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAQNeJRyZH6MeuAAA
// SIG // AAABAzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE4MDcxMjIwMDg0OFoX
// SIG // DTE5MDcyNjIwMDg0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // 0ZR2NuaGqzb+aflGfIuIUMuQcH+wVakkHX455wWfD6x7
// SIG // l7LOcwr71JskXBa1Od0bfjNsEfw7JvOYql1Ta6rD7BO4
// SIG // 0u/PV3/MZcuvTS4ysVYrTjQHif5pIb0+RPveEp2Fv3x2
// SIG // hn1ysXabYeaKZExGzrbVOox3k3dnIZy2WgZeR4b1PNEJ
// SIG // yg09zbLpoVB40YSI4gE8IvyvlgjMXZnA7eulWpiS9chA
// SIG // Tmpzr97jdHrTX0aXvOJnKHeZrMEOMRaPAA8B/kteVA/K
// SIG // xGU/CuOjRtv2LAM6Gb5oBRac5n80v6eHjWU5Jslj1O/F
// SIG // 3b0l/v0o9DSGeawq1V8wkTvkFGrrscoEIwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFEe+wMvhpj/9ZdY48gNdt693
// SIG // 90D/MFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQzNzk2NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAJ/1yVMNPw0m7KJE2A3Rn2OWBks/HlzFM6Ok
// SIG // w2yvH8ABuutl7J4zEA+nrFvUvZBhF+cx58MmtKz1J9NI
// SIG // k4aI/hI1kWQi0WstO6gsFZQp0jeW5jX/DM7IBhYWniSx
// SIG // 4jn5bg542AwbtilgJ3Y0JJvduZd1ywE7rYISFiKAiRWE
// SIG // u5hQILAXJoZJr859RRVDNJbPgVwYLNST8mer4nPIPaPN
// SIG // /DIeYBzpsBsw+yy7By6WhJNFKFRczZb9oNuB2LYwykOx
// SIG // 80jAskYcXV52Klif1O7y9PpITLVhi7CMQemquJ2Q9P9q
// SIG // Qg+5PukO7JT8jYC7eOMjp3hbsm0f+VnBfbbROcl54IMc
// SIG // YAraPbDR7Ta/RQfpGzZu5T07BQOn1KclEo/mdqMTs0Va
// SIG // QzGC2tiErrmwH3X19h19URE3J+i1NYRx91eqrvqJccmY
// SIG // 0p5aZHa+jMN9FWqR8RT08tk1Mbjbcvq0dciIm2q/mEXH
// SIG // ZrLX/86SkHXk6+aG0sgb2yfAW5VvSW9YXWkq3lNL+OjK
// SIG // e/ZsFfkDGQ8RhapPmr+qV91gxvVxIPRRqJrK6dHrNEc9
// SIG // dfoi7FU/ahk5axDpWj+O9CN4MLLypjjLNY2qmFkkQLg6
// SIG // Z6QHX6D+2DtJE/sM4e0LbYNQzvB/PuDZCOiMIUpBwt7r
// SIG // jlvuA8Mdbm7mVDVmZ3J8GupS9iLEcj+uMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFX0w
// SIG // ghV5AgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCggdAwGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIMN2hXL4yJqjCLGZ12FZ
// SIG // 1UOPAQb8HzBTMyDfGeuV3LrMMGQGCisGAQQBgjcCAQwx
// SIG // VjBUoDaANABnAGwAbwBiAGEAbABpAHoAZQAuAGMAdQBs
// SIG // AHQAdQByAGUALgBsAHYALQBMAFYALgBqAHOhGoAYaHR0
// SIG // cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEB
// SIG // AQUABIIBAFBxD5vdz4JpxGcqQ63fK2G960f7tf/h4IdE
// SIG // AOxKIB9GsrPQXhzs1R2npHlgLaDG2ATs+jyrg45wkmyc
// SIG // D/OWzQEYrEnr+u3fmURfJkztWLTbpC31nb4VvRJJkGIl
// SIG // kU3ygSqKXkrsi8wTtIKqnfUc6l0cwoVIH4UOYgb8Ekjb
// SIG // xpwgBiGzJNezA6KUztC9en/hTloqyMhmaS26NhL/FuP+
// SIG // vG/a4bf7qnX7CszjHm3LhCO16ZoruOqSWWqvMS47F7U6
// SIG // G1mw1hxOm9oHm2WTUlm4pDWcyuS7StS0bu637xcNlG58
// SIG // e+l+kNcGa3gtb9tGIJCJnJ3qu7hCQFcr8QdeZPPsriOh
// SIG // ghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkqhkiG
// SIG // 9w0BBwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQCAQUA
// SIG // MIIBUQYLKoZIhvcNAQkQAQSgggFABIIBPDCCATgCAQEG
// SIG // CisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg29iU
// SIG // 7QG7d4Ddjw1WQ+dPSbsRqYaHS6VobNgfOIRNpx4CBlxn
// SIG // dmPYDRgTMjAxOTAzMTIwOTUzMDkuNDQ5WjAEgAIB9KCB
// SIG // 0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldB
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xLTArBgNVBAsTJE1pY3Jv
// SIG // c29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046QTI0MC00Qjgy
// SIG // LTEzMEUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIHNlcnZpY2Wggg48MIIE8TCCA9mgAwIBAgITMwAA
// SIG // AOCyGKnU0cK09wAAAAAA4DANBgkqhkiG9w0BAQsFADB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xODA4
// SIG // MjMyMDI3MDFaFw0xOTExMjMyMDI3MDFaMIHKMQswCQYD
// SIG // VQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcTB1Jl
// SIG // ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
// SIG // dGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IElyZWxhbmQg
// SIG // T3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQLEx1UaGFs
// SIG // ZXMgVFNTIEVTTjpBMjQwLTRCODItMTMwRTElMCMGA1UE
// SIG // AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgc2VydmljZTCC
// SIG // ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMKX
// SIG // +GcOx6ZsnHsUxLlG5omyJAkM/S2KrJ4J622I2UZw2hrj
// SIG // byhW1uUfrJlq0JdnKDKHNucMmh9Mcga12ITNBzl8+F11
// SIG // 9N3iERCB3lyH8GUYhNcUTAnh38aEdlDWFst2IFP+PrtD
// SIG // HXlV65fLmf+Mz0+8hsGSxJbBfy+uSFFP+uprXFauYX5J
// SIG // 9xgrD6kL53e1QeuAAKjRhpUe5LeOWleDfcD6m6XzCJtk
// SIG // FwbEwXUKrCU/QB8xbrQOniqb8kttbF3H+k6KI6sz+3KQ
// SIG // UO0Sc3TsddGNcOEOF8h4ELPgY+IIQWT3gBoXHKwV4Wf2
// SIG // /LPtPIonFSSxcmG1YaraLhaY9ymHIPMCAwEAAaOCARsw
// SIG // ggEXMB0GA1UdDgQWBBRrQdMKtjnOrO/+njita5JtdoCH
// SIG // 6DAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVt
// SIG // VTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNU
// SIG // aW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYBBQUH
// SIG // AQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAAMBMG
// SIG // A1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUA
// SIG // A4IBAQALH96d2ZLkNbrGBvx8h0Soj3rd9QHsihiVg1BT
// SIG // 9hnCrXnm4rWXCFwflHUJpUyv6XI0h8PyX6WrLyZ2i75n
// SIG // ByufOjebZQQY7S40V3hzwh7Dlnj1X7oCiNPrPkgYmHfL
// SIG // nq4MAJDNFmtH7bq4LHWcuxiMr9a3FAOrUgcdZ4DF+sbG
// SIG // wBk7UF1CjbkzHfhmx5WJWP66x+bLSdSZ+9nSEVwx413i
// SIG // Lgp2zTeRj8LBZVkHDra0CM4cr9zzXA7uGK6270lfgw2N
// SIG // oS4V2F6I3CYfICZumpibPor70g8zvmJcQtvOMNzrIsml
// SIG // U6rXuB9UMJrB6vLOBWcLYIjGruAMbJMz1p/Ay0RJMIIG
// SIG // cTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0B
// SIG // AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UE
// SIG // AxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0
// SIG // aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUw
// SIG // NzAxMjE0NjU1WjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX7
// SIG // 7XxoSyxfxcPlYcJ2tz5mK1vwFVMnBDEfQRsalR3OCROO
// SIG // fGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNF
// SIG // DdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0yS
// SIG // wcSmXdFhE24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJ
// SIG // UGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v
// SIG // 0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcv
// SIG // RLqn9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEA
// SIG // AaOCAeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1Ud
// SIG // DgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEE
// SIG // AYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYw
// SIG // DwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbL
// SIG // j+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBH
// SIG // hkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2Ny
// SIG // bC9wcm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0y
// SIG // My5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAC
// SIG // hj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2Nl
// SIG // cnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDCB
// SIG // oAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEw
// SIG // PQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9QS0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYI
// SIG // KwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwA
// SIG // aQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJ
// SIG // KoZIhvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOh
// SIG // IW+z66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4vceo
// SIG // niXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX
// SIG // /1z5Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIA
// SIG // rzgPF/UveYFl2am1a+THzvbKegBvSzBEJCI8z+0DpZaP
// SIG // WSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplm
// SIG // kIz/amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZq
// SIG // kHimbdLhnPkd/DjYlPTGpQqWhqS9nhquBEKDuLWAmyI4
// SIG // ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua
// SIG // 2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHh
// SIG // AN/nMQekkzr3ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm7
// SIG // 7MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI
// SIG // 5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnP
// SIG // GUFN4Ib5KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxE
// SIG // PJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0eGTgv
// SIG // vM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkS
// SIG // oYICzjCCAjcCAQEwgfihgdCkgc0wgcoxCzAJBgNVBAYT
// SIG // AlVTMQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVy
// SIG // YXRpb25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBU
// SIG // U1MgRVNOOkEyNDAtNEI4Mi0xMzBFMSUwIwYDVQQDExxN
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBzZXJ2aWNloiMKAQEw
// SIG // BwYFKw4DAhoDFQDGeaSM5d52mrIdCqQkaft7CFIL0aCB
// SIG // gzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNV
// SIG // BAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
// SIG // MA0GCSqGSIb3DQEBBQUAAgUA4DGYbzAiGA8yMDE5MDMx
// SIG // MjEwMzExMVoYDzIwMTkwMzEzMTAzMTExWjB3MD0GCisG
// SIG // AQQBhFkKBAExLzAtMAoCBQDgMZhvAgEAMAoCAQACAgjR
// SIG // AgH/MAcCAQACAhIcMAoCBQDgMunvAgEAMDYGCisGAQQB
// SIG // hFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMH
// SIG // oSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQADgYEA
// SIG // fkrEKa8AXZbD8nrmvQwCpFlaeX0EwAboqDt+AjHdnreM
// SIG // rhSeqEqQbfl7fE/UFXtxy/WpReOHaaFRfvuvqTm4NrWH
// SIG // gJhSjiJyqQ4Bhux7seneY7DfwNn48qQ+hgFEkZmugqa+
// SIG // oIYNINkNyolmDui37p4+VfkjVPSYotAOhtlic6kxggMN
// SIG // MIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMAITMwAAAOCyGKnU0cK09wAAAAAA4DANBglghkgB
// SIG // ZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3
// SIG // DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCCd27e8RqmKloR+
// SIG // VyZ3BEwpxBDdz50P9SfohLu3i5PtwjCB+gYLKoZIhvcN
// SIG // AQkQAi8xgeowgecwgeQwgb0EIKWBL1WkMyiyV3KDUZA9
// SIG // VWTnDA04P49yXZqgu9GsQl+QMIGYMIGApH4wfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAADgship1NHC
// SIG // tPcAAAAAAOAwIgQg8Wz4J3Ka0IjirhyGmsWtQMXt/t/U
// SIG // cgmAtxV2Wye9L/wwDQYJKoZIhvcNAQELBQAEggEAGekL
// SIG // FuwO0rOhh2GUDKme+U992UV6+o3NIpEf9xPnLR5oqRij
// SIG // xJyNcjnagtD0rpdc82t+6L1T8gSi8iLAnOCdyBPruL6t
// SIG // WU3qp3kyG8REkVtdJPxsFNdXeQT2XPtkwQO3v9pqLfGh
// SIG // gIh0CDFGI5l94ZL6eBe61gBRXe30d0j26IqP0kdlgFqg
// SIG // KyRwXMMZAudgWS978hMq11SoJpha82nxJeuAZlPIusR5
// SIG // 0jBmmcJgZ1DPzbOkneZ+qhREellmOP9m+9LOv6OvZ55b
// SIG // ITEqCioSdMihzFBpo5volusbIZaSgP3EWC0Hg1k0ZsSw
// SIG // LfRGuvAXC1Yj1Qz1Zw7x8WV7sX9DXw==
// SIG // End signature block
