const algo = {
    "pipeline": {
        "connections": {
            "connection": [
                {
                    "_source": "ReconAll_1.RightHemispherePialSurface",
                    "_sink": "OctahedralResample_1.input"
                },
                {
                    "_source": "ReconAll_1.LeftHemispherePialSurface",
                    "_sink": "OctahedralResample_2.input"
                },
                {
                    "_source": "OutputDirectory_1.Output",
                    "_sink": "MakeDir_1.DirectoryName"
                },
                {
                    "_source": "Input_1.Output",
                    "_sink": "ReconAll_1.InputVolume"
                },
                {
                    "_source": "InputIDs_1.Output",
                    "_sink": "ReconAll_1.SubjectID"
                },
                {
                    "_source": "OutputDirectory_1.Output",
                    "_sink": "ReconAll_1.SubjectDirectory"
                },
                {
                    "_source": "MakeDir_1.OutputDirectoryName",
                    "_sink": "ReconAll_1.InputFlowControl"
                },
                {
                    "_source": "OctahedralResample_1.output",
                    "_sink": "RightHemisphereSurface_1.Input"
                },
                {
                    "_source": "OctahedralResample_2.output",
                    "_sink": "LeftHemisphereSurface_1.Input"
                }
            ]
        },
        "icons": {
            "icon": [
                {
                    "_id": "0",
                    "_value": "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"
                },
                {
                    "_id": "1",
                    "_value": "iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAUq0lEQVR42s2a91Pbd5rHM5nMzc7N\nzc7Ozt5kb2PHKQ7GBdO7EAhJICEJVUASKiAkEAKBEEV0RC+iF9NNx3SwARuDwbgkLuuWxHF297Zc\nfri73G6S95+w90ibm7n77W4uAWvmM5IoM3rp/TzP+3l/pTf++te/vvFf54e6yfUO/3SLUyyQW5rU\nhrL7IkXugVhle2SrHPij3lL3r5aSjpcqQ/k0k61knIxK/ckbP/DtfzD90IAqc21019jWN1Wt0yiq\nHUNWcRdqOubR2LuC1KxaSFPt0JprkVnggtHWCmtZ7590ufVORrKN9VoDXoxR/4NcW7xb1nj5m8a+\nZZiLulDtmkdyWhkcjZehz2lCXnkvGnpXobU0QGWsQmXrDErqRtE5NYLm8R5wUjJ/w1HZnK8doFiZ\n944yveywsHoIFfSiM/JboMuuhY5AnB0LsFUNItfRjULnKDTmOjgaJgh0BaQ0imtHYcxvRt/sTVhb\nexEp0sMnVnblRKjg568FoH90kr9Ca/+DylSDTHsHOkY2SZkptAysw0zlWd2+ANfQVTT1r5KKDQQ3\nBkvpAGwVA1CTim2D61TKo5Coc+EbwcPJ85H4pVcQ3vWNWjt2QKZhhJ2Y0fBVmr0WE9dmYXcOo7Jt\nDiYCrWqbxfTGAw9YWfMMarsWUeWaQ133IpydCx4157aeoXWQ4MfXIDNZ8a53ME6cCYJXAIPuA3Ex\nhLl4bICxxsu/4GUP/Y6trUSBqwPqzGrkOHpR0TJNj2sxvnzfA+uGKqwZhq1mFM0DG+gc20Z+1Qj9\n3STyKwdR37NMZT2OwaUJSLUqyPV2OLoG4RPBwRm/iG/jhVLtsQDyskccgswWRChsCFNkg5ViIZhp\nTKw9RG5ZH1oGN6kX29Dcv4aB2QP0Te5idOk+BucPaaIuo7ZnDe2j1zGx/ghLO5+iuP4yeqZ20NK/\njKbhBch0qfjwYjjixYqv86vqPzxSwGBF/duCTNfXPH0ZGPJc+PEzkFnXDGffImra5z0vvGN0i+63\n0dS36oHtmdhB78R1UvA6Zq4+gmvkOgamb9KAaUX78AZq6M3ZOHiFeirhpYM9MPgSvOMdggshLKTZ\nndNHCpho6ZsWGJ0Qmcpgqe2B1FSI1TtbKG+dIyvoxySp0j9zG67hTbSPbKOX1JtYuY/WoS009CwR\nyJeeYTS+fA/FjTME/JhKdcXzZtR3z2Nubx7vXQjHifPhOBcUDZWl9GuVpfjtIwOU53W+EBnKUDM6\nhsVbzz3DZWD6FkqbZ6mvhnBl+ykuUVk29q0T4CaGF+5Sqa4S5F10T+yieXALKztPcfX2K/SRqt0T\nexiYu0PlS2/K2AYGFrvx/kUGQnlSXAhmgitIQmZlp+1IAHmWmZ+JzU3fSI0VGFieQscYqTR8FQMz\nB+iZ3CMbGMfijWeo7VzEpZk9z++mNx5i+eZnaB3ZQXXnMqbWH2CR+m5l9wUWrz/F0NwtTK7eQ9f4\nNrIK29E+voyc0l5MbuxCpFQihs1HXvPw5pEAykqXNcm2dkhM1WgYHUdpywip5DbsYU+JtQ1tQpfb\nRrawBHvNCOq6FjzTdHCOBg0NkSWCH1l+iMm1T8gvp2lla6a+nUMuAfVcvg5raRcGr1xD86UVOLtG\nEclNAJuULBlcfnwkgMnVa0PJ9i5IyBasde1k5AOk0jUCWUIVGXyuw4UMaxW0OVVQ5ThhKenyTNN8\nMnYN2cfowr6nZMsbR2GiXdRtIY6Gy7TxXEGRcwQFVZdw+eoCWAo1TgfH4lxwNISKdNj7Fp8dCaCy\nced+EilY2T2A4uYh9M+uUinu0+ayDIXBhuTscsgzSyChx1KdBdNbTzwK67KroTaVIj2nHElaM7gS\nJSL5MirlOTL+JXRSeQbGJMIvOhEBbAnBcXHKPxbnQzngi1Qo6F44GkCV6/bvZdY29C4tIDm93GPY\nruEtaCgppNsbkWR2QOoGNBVBnJYL19SGpwdzK1zQ5FchJasQCWoTWHI9AuIVSDKWoKz1MsTphXg/\nJB6ngnk4EUjHLxYnfKJxkYZMAgEWto/9/kgAtT2ffC229SLRXAVTWQP6ZpZo0OxAb22FpaKD4IqR\nmFlGFlJKxwFFtgOmilakV/dBW9ZJz0vBSjYiSKDGWZYU74a4gbj4VQAXJwnu3ZAE/Mqfi388G4W3\nz0biTAATMfEyFDa7YHO1sH90wIzBR/8mKx4Ez1SLrJoO8r5e2i/noLSUQ5xVDmFWJYTkjwKjgwDL\nIcuthbayH2bXFOL0uQjhicESiJGQpIbClAd5TjEkZjv84pNwKoSPd0MF+Cc/Dn55gYlAegPEqmyY\nSl2w1LhQ6nL1/eiAeZPPX+ma1iCxX0JycS/0pd2QZNcRWDVE5hoIzU4ITBXgZ5SCb3BAbCHA6kEo\n7XXgak2IS1JCrjVAlmFDoqEAAp0VwlQT/Jhx+CCMj/fChDgRxENihhUJaYXgyowwOofQsbqJ/MZW\n/Y8OWDZxdye95xD6xmWYXBuINdQjSJKNBLINfiZBGGsRZ6gEW1cCtp5UpFwopXwoNhUjpdiJ5IIS\nBMXycYY2lDOBTJwLicYHQSx4MYUIEavxAUOCEzRcTlKaeN87iHowBjHCFEweXPvKUZX61o8OWDn/\nsNw8+gQ5PdcQqS5DoCQHTK0DfgIT4k1OsNMrEaOrQLTGAZbGDnFuHRSFreDr80lVG0ITU3EhWoT3\nAljwj+JCY6vAuYh4hNHQURdVIkiowfsBMfjlB7445RUABksEvkyH0v7JpSMZMqUTt07lTz7/NsN1\nFdq6acRnd+B8gglnOFqwDbUEV4koTQUYqQ4wVIXUqzVIKumENK8RTGUuAhLTEJOahVBJKsL4UrCE\nSQhgCcFJs0LjqEOMKgcnSUEvShIRzAToitqQQpPZ6GgeO7JdNG/ixUtd8yYKhm4gSFEIH6EZfokW\ncDLoBeqrEa2rAkPtQGSKjcqULMPejuTyQSTmNoCpyoNvgg4XeBqcYyvwfrgA3rHJYGkLoMirAEdX\ngHcC4vAeLdoXAqNpGGVCpEhD6cjy9pEB2qZeTRs69pHdvwfvuHSwM5vBz2pAfFYz2BkNiEmrBTO1\nBJHJeWAo88HLdEJudyGpqJMgGz0QwRITznJUeC9Cgvei5AiSmiAke+EbSvAh9eGFEA7ePh2M0xfC\noDKXo2n55pOjU3D8qXfWwCff6l3XcTpaCQHtnoIsJ8T5HRDmtCLO2IhYbSkik3IQKTeDrS2GyFIH\nqa0N4hyauGQfnFQrwmVU2iwFTtHk9I5NAkdLimvtuEjq+lFfnjgTDN/AKBhKOtC4dPOzI030tqkv\n7pl6biFE6YAP9aCU9lNV7TSkRQPgZRGgrhRRKVaEyrLASLaCS1uPILsBArISHqnEIsAwAjzHUeJk\nEG0wYQIECrX0M1oCRHpcCI+Ht380ATKQToCu9ZufHymgcfhTq238MdJaN6m/JqAs7UN29wqUNZNI\ntDaDm1ZOgLkIl2cjgpSMUdsQl1FBk7YaXH0hPbciRJKB00wp3qFNxo+nwjmWHN5k7oykdJwJZiGC\nLcO5i2HQ2Vswurf79EgBzaOfsiwTL+Gcu4f0tlWoywdQMroBTeMsxLYOxBtrwFTbafxbPJBMpZUG\nSRFNSwf1oJ16MweBYgM+IsAQiR4cpR5RCXKI9BYwKODGipRgk5peHsBm9F1bGz5SQHXjrZ/kT332\nddHIHvR1E7Sx1KB+fgem9hkoinuQQIMlVluCCIILk5k9/RiTaqM+ywdbk0/PzVSKOoRJ0xFJcUhA\nW47b/85FJsA5MoxUezVOX4yAt08ITJXd3/XMX4o48uuiJbNPnuo792lbqacFuxT923dh7ZuFumYU\nkoIOGjbVYFKZBtOEDFeYqSzzqPfySU0LQZmoFE30fyWIT6Npm+S+oi3C2VAWTvtGwjcoAl5+bquI\nQE6t67fHcuG3aObZhnnk11DWryOZwuvUwQM4xq5B37KAlPJhDzibVIuQZ5FSGYhOyUGsykrq0eAh\nQL6hCNLsMiSk5yNCocdFthgBkRx8QMqFhEfDPyQKgaFRyKlwXj4WwILJx53WyedIbT+AwjGEvvVb\nVKZ7yOy7AXXdLO2gbYjTFZJaWYikfmImk4opWQiXpCFMrEOcNtcDF0VDJdTdd2INOGI9mDwluIIU\nBIUxEc0VoMA1mn4sgLnD9yzFs0+R1r0PZeVlFPfMoH3tEDYKwDpa5ZJKL5F50+Lt9jyCilIQZJIR\nkVI9GDI92CkGBPMVCOQmIjiGj0iRlkq2gqqhAQqKXyG0q6qyCr4bmGnxOhZAXesNdumV50jruwdl\n1TTk1HcF3fMom95DVv8OUilxKApclA3LwFKSXcgMiJCSeolaRCdlgK+zgK3KgFcEpYswLoIi2bgY\nGoPACA5i4yRgsgUobr90/9g+fNE077xftfAEpoG7UFZMQG7rpE2lFdauBRRSys+kxKGrnUJKYRsk\nlO7jNLmkmhEsmpoxdDikYBwBMgRyRHJEYBO41FAITVETTOUtSDHkYOjqvOHYALMHDv++dvHxN+ZL\nd5BCgDI3oHttMzdBU9GPgsE1ZLrmoHeOIqWgAdIshyfkCjVm8NSZ4KakI0qiQQBXCl9SzT+cg1BW\nIsTpRQTYieb5jT86WjLfPNbPB2uXHv9H5sChp0QVBV20TLsgzKblO6MagowyGOv6kNkyBH1FKxS5\npRAZrB7PS9AaIaRkH6cmSKkaoQnUi7EC+LMECKVAXNLZj7uvrm4c6+eDmX0bb9UvP/pL1qVDJFfN\nQpLXSftmC6WHBkr1VeRvpQSSj0RK8+qicsp75ZBb8iAzmSFJNyJRo4dIpQFPloQERQr4UgUEsmSk\nZFgwvLX27Z2XA9HHClg0evPnjcsPvzP17SOpYhKCHFrRTI2IN1QiXu9AvK4IXHUu9VsG2YASrJQ0\nqPLtyKquowBbDYO9HIbCahiLG5Bd1YPcxlEUtE+heekmtp+sDB77J7zVs4fn2lY/pmGyA0XFNMWm\nLk8m5GWQehR0ubS1sMjUI8XpCE5IhX98CnxiJPBliiCgYWKsG0QtrXddm/sY2dvH2qObuP3F5h/u\nfDEqeS2+hNBz/ZmgcekejN03oKiagzCvFzxzG+IzasGlDBiTTCsZbTChFH/8+anw4SbjPEsG70gh\nTofy8VEwFwEMLjh8KdKsFQS6h0/+eXP0tfmWxcitT4vqrtyBgXKhonIWwvw+JFCZ8rNbKTVUIooA\nIyQGhAh1HvUuxMpxPlqCc1GJ5H1CeIXGIyAqHrFcIbTZpWhY3MWdV2tDrw3g5MHzpYqZQ6T1HEJe\nPu0B5FuoD82U6tMrydxp75QaEUYKBvLUtGsm4UIMZTyC9I4Swzucj6BongdQb6lA+eUtLN9f7n0t\nAPO6l96cuv3iD0WT96Dvvg1Z2QSEtl7qQwJ0T1H3dVEKudG0f7rLNFighX8c9SCpeC5aCi9GIm0v\nPITE8BAdy4NSn4eS4auYurXyegBuP3sVN7r3HNaxj6Ht2IO01A3oLtF28IzuHiwiwDxaxaxgUlRy\nq+gXp4QPW4HzpOKZKIL8XsEoApQpjSjsW0Hf1o3hYwd0Td9889qTLx/VLT1CxqUHULbsQuIYh8gD\n6KLyLAdXUwgORSV3PIpSZFIfauEXr/IoeCFG6inRs5ECBDDjERkTB5FUg8LeZXRcuzV57IBX7n06\nNbjzzKOepvMQitp1iIrGkJDXDx7ZBMd9aUJj92RBt4IMmQlBCRr4cmnQ0BQ9TyXqzZTgLEMIPxoy\nETFc8IXJKB5cx6XtzZfDwzFvHhvg5pNX9b3bT78rnLgDfdceUho2IC4jD7QPgZfT6RkubuU4HgUL\nKDVkI5x80P/78nT3n3vInKVJeiYiARcZPAKMAy9BDnvPIqbv7OHGryfKjxywYXT175buf7YzcP0J\n8ob2oevYRUrjJiRls+AVXEZcTj+4xjoPmFs5NxxbnU/qGT0Dxocm6FmCOxNFEzRCAG+GiO758ImM\n/xsgJQpb+yxc62T4D3ew8clc1ZEBXjl4EHpp68nv6q48gIXSemrjChTOFSSWzYFnHQDX3AGOibwv\nvZpSeiH1X4EH0N1/bh8Mcps8Af5tuIhxJlJER0AKCnA+Ih4hTC4EIjnS8p0oHlhD0/I+lh/sfHf7\ni/V7Nx60e/1ogHM7H/9sau9pW9fGk7/kDdPG4tqEpmEJ8uoFiB0TSMgfBCerA+yMRrANDQRYA67O\nQRO08HvAXAq3aWTyajJ5hac0vdyA7uNWkM5ZUtE3Mg4xHB4Eicm0lzajdOwGWlf3MXWwi5ufbv15\n/7Plpv0X814/KOD64UPGzMGLf6mafQQLxaH0lnWonVdoY5lBYskEeHkD4Jg7wcpoQizBxabXgesG\n1JeRgnbPHhrjvjRI6vlykj2AnhJl/m2CnqEe9I5yK5lAkDz4RPHBILtI1mYjl3bUkqFrqJi6RWoe\nEOgebn62/e/DO1eaAg21P/1/AV7dv39y4/7z/b5rT761jz/8NrPn4Ku0ptUXypq5O7LymR2RfWQz\nztK7yTa5rscaGg9jDfWP6HzJyaj/imtw/pmjr/iOrSny9J/b//zJGi66AalE3f3nRYAfkXIeo6cp\n6j7eBHkukk+WwUMClaoiNQuZjlbkN4+jZPAqyid20bZ2gIX7u9j7fOurO69Wtmd3Gj78PwOu33vE\n2Pz4+U732sddeYO3xTLntZ/+X2r/orToTb/kql8EJ5WcDE+yhYZKsoy+8an9PpyUXQJ85hUl+e1H\nTNk3bvW8vi9RL1q8vQnSfcHXJyIO0ex4xPNFkKsykG6tRE51L+yd83CMbKFq5ha6r+1j8eNd3Pp8\n85uDlwuL9768Iv5fA/Zevf7WGz/y7cNY/c/OMBUi72hpF3nhtndU4hcE/PXZKCF8GHwEsxIQxaZ+\nFEmhUKVBm1mAzKJG5DUMo7hnCWXjO3BeOcTQjX1cfXwTd36zjbtfrr7cfzFVVNOd9OYPfsnih7id\njEl561R08oekpMg3mp9CkBpWvLCQlyhvkSRr+9QZeePGQudiTlX3Zkn3/O3Ksc1HtbM7X3SvXv/9\nyt31P914svrV7ZfLf7r9+ezh9U869f+d6T8Bwifre53LyB0AAAAASUVORK5CYII="
                }
            ]
        },
        "moduleGroup": {
            "metadata": {
                "data": {
                    "_key": "__creationDateKey",
                    "_value": "Fri Jan 22 17:45:53 PST 2010"
                }
            },
            "dataModule": [
                {
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Fri Jul 18 10:34:47 PDT 2008"
                        }
                    },
                    "output": {
                        "format": {
                            "fileTypes": {
                                "filetype": {
                                    "need": "hdr",
                                    "_name": "Analyze Image",
                                    "_extension": "img",
                                    "_description": "Analyze Image file"
                                }
                            },
                            "_type": "File",
                            "_cardinality": "1"
                        },
                        "_id": "Input_1.Output",
                        "_name": "Output",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "-1"
                    },
                    "fileTypes": {
                        "filetype": {
                            "need": "hdr",
                            "_name": "Analyze Image",
                            "_extension": "img",
                            "_description": "Analyze Image file"
                        }
                    },
                    "values": {
                        "value": "pipeline://cranium.loni.usc.edu/LONI/data/Pipeline_Workflow_Test_Data/Training/raw_data.img"
                    },
                    "_id": "Input_1",
                    "_name": "Input",
                    "_package": "LONI",
                    "_version": "1.0",
                    "_posX": "96",
                    "_posY": "55",
                    "_sourceCode": "",
                    "_type": "File",
                    "_source": "true",
                    "_loopIndex": "false",
                    "_serverAddress": "cranium.loni.usc.edu"
                },
                {
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Fri Jul 18 10:34:47 PDT 2008"
                        }
                    },
                    "output": {
                        "format": {
                            "_type": "String",
                            "_cardinality": "1"
                        },
                        "_id": "InputIDs_1.Output",
                        "_name": "Output",
                        "_description": "This list contains Inpurt Data Identifiers (IDs)",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "-1"
                    },
                    "values": {
                        "value": "testdata"
                    },
                    "_id": "InputIDs_1",
                    "_name": "Input IDs",
                    "_description": "This list contains Inpurt Data Identifiers (IDs)",
                    "_posX": "92",
                    "_posY": "208",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_type": "String",
                    "_source": "true",
                    "_loopIndex": "false"
                },
                {
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Fri Jul 18 10:34:47 PDT 2008"
                        }
                    },
                    "output": {
                        "format": {
                            "_type": "String",
                            "_cardinality": "1"
                        },
                        "_id": "OutputDirectory_1.Output",
                        "_name": "Output",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "-1"
                    },
                    "values": {
                        "value": "{$tempdir}/{$username}"
                    },
                    "_id": "OutputDirectory_1",
                    "_name": "Output Directory",
                    "_posX": "92",
                    "_posY": "299",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_type": "String",
                    "_source": "true",
                    "_loopIndex": "false"
                },
                {
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Tue Jan 19 15:53:48 PST 2010"
                        }
                    },
                    "input": {
                        "format": {
                            "fileTypes": {
                                "filetype": {
                                    "_name": "MNI obj ascii",
                                    "_extension": "obj",
                                    "_description": "MNI obj ascii file"
                                }
                            },
                            "_type": "File",
                            "_cardinality": "1"
                        },
                        "_id": "RightHemisphereSurface_1.Input",
                        "_name": "Input",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "-1"
                    },
                    "fileTypes": {
                        "filetype": {
                            "_name": "MNI obj ascii",
                            "_extension": "obj",
                            "_description": "MNI obj ascii file"
                        }
                    },
                    "values": {
                        "value": "pipeline://cranium.loni.usc.edu/{$tempdir}/{$username}/freesurfer/right_corticalsurface.obj"
                    },
                    "_id": "RightHemisphereSurface_1",
                    "_name": "Right Hemisphere Surface",
                    "_posX": "731",
                    "_posY": "300",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_type": "File",
                    "_source": "false",
                    "_loopIndex": "false",
                    "_serverAddress": "cranium.loni.usc.edu",
                    "_dirDump": "false"
                },
                {
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Tue Jan 19 15:53:48 PST 2010"
                        }
                    },
                    "input": {
                        "format": {
                            "fileTypes": {
                                "filetype": {
                                    "_name": "MNI obj ascii",
                                    "_extension": "obj",
                                    "_description": "MNI obj ascii file"
                                }
                            },
                            "_type": "File",
                            "_cardinality": "1"
                        },
                        "_id": "LeftHemisphereSurface_1.Input",
                        "_name": "Input",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "-1"
                    },
                    "fileTypes": {
                        "filetype": {
                            "_name": "MNI obj ascii",
                            "_extension": "obj",
                            "_description": "MNI obj ascii file"
                        }
                    },
                    "values": {
                        "value": "pipeline://cranium.loni.usc.edu/{$tempdir}/{$username}/freesurfer/left_corticalsurface.obj"
                    },
                    "_id": "LeftHemisphereSurface_1",
                    "_name": "Left Hemisphere Surface",
                    "_posX": "728",
                    "_posY": "169",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_type": "File",
                    "_source": "false",
                    "_loopIndex": "false",
                    "_serverAddress": "cranium.loni.usc.edu",
                    "_dirDump": "false"
                }
            ],
            "module": [
                {
                    "authors": {
                        "author": {
                            "_fullName": "Ryan Cabeen",
                            "_email": "rcabeen@loni.ucla.edu",
                            "_website": ""
                        }
                    },
                    "uri": "http://www.loni.ucla.edu/twiki/bin/view/Main/BorisGutman",
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Fri Dec 19 16:21:49 GMT-08:00 2008"
                        }
                    },
                    "input": [
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "_id": "OctahedralResample_1.input",
                            "_name": "input",
                            "_description": "This is the input shape.  This must be closed and in a format supported by the ShapeTools library.",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "1"
                        },
                        {
                            "format": {
                                "_type": "Number",
                                "_cardinality": "3"
                            },
                            "values": {
                                "value": [
                                    "384",
                                    "384",
                                    "384"
                                ]
                            },
                            "_id": "OctahedralResample_1.resolution",
                            "_name": "resolution",
                            "_description": "This specifies the image resolution used when resampling.  Larger values allow the algorithm to capture more anatomic detail.  A reasonable choice is the resolution of the image from which the original surface was constructred.\t ",
                            "_required": "false",
                            "_enabled": "false",
                            "_order": "2",
                            "_prefix": "--res",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_1.overwrite",
                            "_name": "overwrite",
                            "_description": "Enables output overwriting",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "3",
                            "_prefix": "--overwrite",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_1.verbose",
                            "_name": "verbose",
                            "_description": "Enables verbose reporting",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "6",
                            "_prefix": "--verbose",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "values": {
                                "value": "pipeline://cranium.loni.usc.edu/LONI/apps/rcabeen/ResampleSurfaceToOctahedral.py"
                            },
                            "_id": "OctahedralResample_1.executable",
                            "_name": "executable",
                            "_description": "The path to the python executable",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "0"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_1.fixtopology",
                            "_name": "fix topology",
                            "_description": "Fix the surface topology.  This will ensure that the surface will be spherical, but some fine detail may be lost in the process",
                            "_required": "false",
                            "_enabled": "false",
                            "_order": "4",
                            "_prefix": "-t",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_1.simplify",
                            "_name": "simplify",
                            "_description": "Simplify the surface before resampling",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "5",
                            "_prefix": "-s",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        }
                    ],
                    "output": {
                        "format": {
                            "fileTypes": {
                                "filetype": {
                                    "_name": "MNI obj ascii",
                                    "_extension": "obj",
                                    "_description": "MNI obj ascii file"
                                }
                            },
                            "_type": "File",
                            "_cardinality": "1"
                        },
                        "_id": "OctahedralResample_1.output",
                        "_name": "output",
                        "_description": "This is the output shape.",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "7"
                    },
                    "executableAuthors": {
                        "author": {
                            "_fullName": "Boris Gutman, Ilya Eckstein, Ryan Cabeen",
                            "_email": "",
                            "_website": ""
                        }
                    },
                    "license": "http://www.loni.ucla.edu/Software/license.php\nBy registering for downloads from the UCLA Laboratory of Neuro Imaging, you are agreeing to the following terms and conditions as well as to the Terms of Use of the LONI website. To view the LONI website's Terms of Use go to, http://www.loni.ucla.edu/software/termsofuse.php.\n\n    * Permission is granted to use this software without charge for non-commercial research purposes only.\n    * Other than the rights granted herein, LONI retains all rights, title, and interest in LONI software and Technology, and You retain all rights, title, and interest in Your Modifications and associated specifications, subject to the terms of this License.\n    * You may make verbatim copies of this software for personal use, or for use within your organization, provided that you duplicate all of the original copyright notices and associated disclaimers. If you provide the use of the software to other users within your organization, they also must comply with all the terms of this Software Distribution Agreement.\n    * YOU MAY NOT DISTRIBUTE COPIES of this software, or copies of software derived from this software, to others outside your organization without specific prior written permission from the UCLA Laboratory of Neuro Imaging, except where noted for specific software products.\n    * You must not remove or alter any copyright or other proprietary notices in the software.\n    * Software has not been reviewed or approved by the Food and Drug Administration, and is for non-clinical, IRB-approved Research Use Only. In no event shall data or images generated through the use of the Software be used in the provision of patient care.\n    * THE SOFTWARE IS PROVIDED \"AS IS,\" AND THE UNIVERSITY OF CALIFORNIA AND ITS COLLABORATORS DO NOT MAKE ANY WARRANTY, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, NOR DO THEY ASSUME ANY LIABILITY OR RESPONSIBILITY FOR THE USE OF THIS SOFTWARE.\n    * This software is for research purposes only and has not been approved for clinical use.\n    * You may publish papers and books using results produced using software provided by this site provided that you reference the appropriate citations. A list of citations is available here.\n    * You agree to comply with LONI's Trademark Usage Requirements, as modified from time to time, described in the \"Use of Materials Limitations\" section of the LONI Terms of Use Agreement. Except as expressly provided in this License, you are granted no rights in or to any LONI trademarks now or hereafter used or licensed by LONI.\n    * All Technology and technical data delivered under this Agreement are subject to US export control laws and may be subject to export or import regulations in other countries. You agree to comply strictly with all such laws and regulations and acknowledge that you have the responsibility to obtain such licenses to export, re-export, or import as may be required after delivery to you.",
                    "_id": "OctahedralResample_1",
                    "_name": "OctahedralResample",
                    "_package": "LONI",
                    "_version": "1.0",
                    "_description": "This module resamples an arbitrary closed surface to have an octahedral triangulation.  The input and output file formats may be any supported by the ShapeTools library.",
                    "_icon": "1",
                    "_posX": "514",
                    "_posY": "308",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_location": "pipeline://cranium.loni.usc.edu/python"
                },
                {
                    "authors": {
                        "author": {
                            "_fullName": "Ryan Cabeen",
                            "_email": "rcabeen@loni.ucla.edu",
                            "_website": ""
                        }
                    },
                    "uri": "http://www.loni.ucla.edu/twiki/bin/view/Main/BorisGutman",
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Fri Dec 19 16:21:49 GMT-08:00 2008"
                        }
                    },
                    "input": [
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "_id": "OctahedralResample_2.input",
                            "_name": "input",
                            "_description": "This is the input shape.  This must be closed and in a format supported by the ShapeTools library.",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "1"
                        },
                        {
                            "format": {
                                "_type": "Number",
                                "_cardinality": "3"
                            },
                            "values": {
                                "value": [
                                    "384",
                                    "384",
                                    "384"
                                ]
                            },
                            "_id": "OctahedralResample_2.resolution",
                            "_name": "resolution",
                            "_description": "This specifies the image resolution used when resampling.  Larger values allow the algorithm to capture more anatomic detail.  A reasonable choice is the resolution of the image from which the original surface was constructred.\t ",
                            "_required": "false",
                            "_enabled": "false",
                            "_order": "2",
                            "_prefix": "--res",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_2.overwrite",
                            "_name": "overwrite",
                            "_description": "Enables output overwriting",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "3",
                            "_prefix": "--overwrite",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_2.verbose",
                            "_name": "verbose",
                            "_description": "Enables verbose reporting",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "6",
                            "_prefix": "--verbose",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "values": {
                                "value": "pipeline://cranium.loni.usc.edu/LONI/apps/rcabeen/ResampleSurfaceToOctahedral.py"
                            },
                            "_id": "OctahedralResample_2.executable",
                            "_name": "executable",
                            "_description": "The path to the python executable",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "0"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_2.fixtopology",
                            "_name": "fix topology",
                            "_description": "Fix the surface topology.  This will ensure that the surface will be spherical, but some fine detail may be lost in the process",
                            "_required": "false",
                            "_enabled": "false",
                            "_order": "4",
                            "_prefix": "-t",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "0"
                            },
                            "_id": "OctahedralResample_2.simplify",
                            "_name": "simplify",
                            "_description": "Simplify the surface before resampling",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "5",
                            "_prefix": "-s",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        }
                    ],
                    "output": {
                        "format": {
                            "fileTypes": {
                                "filetype": {
                                    "_name": "MNI obj ascii",
                                    "_extension": "obj",
                                    "_description": "MNI obj ascii file"
                                }
                            },
                            "_type": "File",
                            "_cardinality": "1"
                        },
                        "_id": "OctahedralResample_2.output",
                        "_name": "output",
                        "_description": "This is the output shape.",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "7"
                    },
                    "executableAuthors": {
                        "author": {
                            "_fullName": "Boris Gutman, Ilya Eckstein, Ryan Cabeen",
                            "_email": "",
                            "_website": ""
                        }
                    },
                    "license": "http://www.loni.ucla.edu/Software/license.php\nBy registering for downloads from the UCLA Laboratory of Neuro Imaging, you are agreeing to the following terms and conditions as well as to the Terms of Use of the LONI website. To view the LONI website's Terms of Use go to, http://www.loni.ucla.edu/software/termsofuse.php.\n\n    * Permission is granted to use this software without charge for non-commercial research purposes only.\n    * Other than the rights granted herein, LONI retains all rights, title, and interest in LONI software and Technology, and You retain all rights, title, and interest in Your Modifications and associated specifications, subject to the terms of this License.\n    * You may make verbatim copies of this software for personal use, or for use within your organization, provided that you duplicate all of the original copyright notices and associated disclaimers. If you provide the use of the software to other users within your organization, they also must comply with all the terms of this Software Distribution Agreement.\n    * YOU MAY NOT DISTRIBUTE COPIES of this software, or copies of software derived from this software, to others outside your organization without specific prior written permission from the UCLA Laboratory of Neuro Imaging, except where noted for specific software products.\n    * You must not remove or alter any copyright or other proprietary notices in the software.\n    * Software has not been reviewed or approved by the Food and Drug Administration, and is for non-clinical, IRB-approved Research Use Only. In no event shall data or images generated through the use of the Software be used in the provision of patient care.\n    * THE SOFTWARE IS PROVIDED \"AS IS,\" AND THE UNIVERSITY OF CALIFORNIA AND ITS COLLABORATORS DO NOT MAKE ANY WARRANTY, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, NOR DO THEY ASSUME ANY LIABILITY OR RESPONSIBILITY FOR THE USE OF THIS SOFTWARE.\n    * This software is for research purposes only and has not been approved for clinical use.\n    * You may publish papers and books using results produced using software provided by this site provided that you reference the appropriate citations. A list of citations is available here.\n    * You agree to comply with LONI's Trademark Usage Requirements, as modified from time to time, described in the \"Use of Materials Limitations\" section of the LONI Terms of Use Agreement. Except as expressly provided in this License, you are granted no rights in or to any LONI trademarks now or hereafter used or licensed by LONI.\n    * All Technology and technical data delivered under this Agreement are subject to US export control laws and may be subject to export or import regulations in other countries. You agree to comply strictly with all such laws and regulations and acknowledge that you have the responsibility to obtain such licenses to export, re-export, or import as may be required after delivery to you.",
                    "_id": "OctahedralResample_2",
                    "_name": "OctahedralResample",
                    "_package": "LONI",
                    "_version": "1.0",
                    "_description": "This module resamples an arbitrary closed surface to have an octahedral triangulation.  The input and output file formats may be any supported by the ShapeTools library.",
                    "_icon": "1",
                    "_posX": "513",
                    "_posY": "136",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_location": "pipeline://cranium.loni.usc.edu/python"
                },
                {
                    "authors": {
                        "author": {
                            "_fullName": "Petros Petrosyan",
                            "_email": "petros.petrosyan@loni.ucla.edu",
                            "_website": "http://www.loni.ucla.edu"
                        }
                    },
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Wed May 12 17:07:35 PDT 2010"
                        }
                    },
                    "input": {
                        "format": {
                            "_type": "String",
                            "_cardinality": "1"
                        },
                        "_id": "MakeDir_1.DirectoryName",
                        "_name": "Directory Name",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "0",
                        "_prefix": "-p",
                        "_prefixSpaced": "true",
                        "_prefixAllArgs": "false"
                    },
                    "output": {
                        "format": {
                            "transform": [
                                {
                                    "_order": "0",
                                    "_operation": "Append",
                                    "__text": "."
                                },
                                {
                                    "_order": "1",
                                    "_operation": "Subtract",
                                    "__text": "."
                                }
                            ],
                            "_type": "Flow Control",
                            "_cardinality": "1"
                        },
                        "_id": "MakeDir_1.OutputDirectoryName",
                        "_name": "Output Directory Name",
                        "_required": "true",
                        "_enabled": "true",
                        "_order": "1",
                        "_includeTransformedParameter": "false"
                    },
                    "_id": "MakeDir_1",
                    "_name": "MakeDir",
                    "_icon": "1",
                    "_posX": "220",
                    "_posY": "396",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_location": "pipeline://cranium.loni.usc.edu/mkdir"
                },
                {
                    "authors": {
                        "author": {
                            "_fullName": "Edward Lau",
                            "_email": "eplau@ucla.edu",
                            "_website": "http://www.loni.ucla.edu"
                        }
                    },
                    "uri": "http://surfer.nmr.mgh.harvard.edu/fswiki/ReconAllDevTable",
                    "metadata": {
                        "data": {
                            "_key": "__creationDateKey",
                            "_value": "Wed Apr 09 14:21:17 PDT 2008"
                        }
                    },
                    "input": [
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "File",
                                        "_extension": "",
                                        "_description": "Any type of data file"
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "_id": "ReconAll_1.InputVolume",
                            "_name": "Input Volume",
                            "_description": "Original MR file to be processed by FreeSurfer.",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "0"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "1"
                            },
                            "_id": "ReconAll_1.SubjectID",
                            "_name": "Subject ID",
                            "_description": "Name or identification of the subject whose MR is being processed.\nA directory will be made with this name in the specified Subject Directory.",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "1"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "1"
                            },
                            "_id": "ReconAll_1.SubjectDirectory",
                            "_name": "Subject Directory",
                            "_description": "The absolute file path to the directory in which FreeSurfer should do its work.\nA directory with the Subject ID as its name will be created in this directory.\nThere, FreeSurfer will establish its necessary directory structure.",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "2"
                        },
                        {
                            "format": {
                                "_type": "Flow Control",
                                "_cardinality": "1"
                            },
                            "_id": "ReconAll_1.InputFlowControl",
                            "_name": "Input Flow Control",
                            "_description": "Input to force order of execution",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "6"
                        },
                        {
                            "format": {
                                "_type": "String",
                                "_cardinality": "0"
                            },
                            "_id": "ReconAll_1.Overwrite",
                            "_name": "Overwrite",
                            "_description": "overwrite files in output directory",
                            "_required": "false",
                            "_enabled": "true",
                            "_order": "5",
                            "_prefix": "-no-isrunning",
                            "_prefixSpaced": "true",
                            "_prefixAllArgs": "false"
                        }
                    ],
                    "output": [
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "Pial",
                                        "_extension": "pial",
                                        "_description": ""
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "_id": "ReconAll_1.LeftHemispherePialSurface",
                            "_name": "Left Hemisphere Pial Surface",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "3"
                        },
                        {
                            "format": {
                                "fileTypes": {
                                    "filetype": {
                                        "_name": "Pial",
                                        "_extension": "pial",
                                        "_description": ""
                                    }
                                },
                                "_type": "File",
                                "_cardinality": "1"
                            },
                            "_id": "ReconAll_1.RightHemispherePialSurface",
                            "_name": "Right Hemisphere Pial Surface",
                            "_required": "true",
                            "_enabled": "true",
                            "_order": "4"
                        }
                    ],
                    "executableAuthors": {
                        "author": {
                            "_fullName": "Edward Lau",
                            "_email": "eplau@ucla.edu",
                            "_website": "http://www.loni.ucla.edu"
                        }
                    },
                    "license": "http://surfer.nmr.mgh.harvard.edu/fswiki/FreeSurferLicense\nEnd-User Licensing Agreement (\"EULA\") for FreeSurfer\n\nIMPORTANT- READ CAREFULLY: This End-User License Agreement (\"EULA\") is a legal agreement between you, the \"licensee\" (either an individual or a single entity), and CorTechs Labs, Inc.. For the purposes of this EULA, FreeSurfer includes computer software, documentation and sample datasets, the associated media, any printed materials, and any online or electronic documentation. By installing, copying, or otherwise using FreeSurfer, the licensee agrees to be bound by the terms of this EULA. If you do not agree to the terms of this EULA, then you may not install, copy or otherwise use FreeSurfer, and you are required to destroy the CD and remove any files that you may have already installed.\n\n1. GRANT OF LICENSE. This EULA grants the licensee the following rights: Software. The licensee may install one copy of FreeSurfer on a single computer. Network Use. The licensee may use FreeSurfer over an internal network, and the licensee may distribute FreeSurfer to other computers over an internal network. Documentation. The licensee may make a copy of the documentation for internal use only. This EULA grants the licensee a nonexclusive, nontransferable, no-cost, royalty free right to use the FreeSurfer for licensee's internal, non-commercial, non-clinical, academic research purposes only, under the terms of this agreement.\n\n2. LIMITATIONS Academic Version.\n\nFreeSurfer can only be used by Colleges, Universities, and other Non-Profit Research Organizations for research only. Colleges, Universities, and other Non-Profit Research Organizations may not use FreeSurfer in any commercial arrangement to any third-parties when payments are made for services rendered, either directly, or indirectly, when the functionality contained within FreeSurfer has been used.\n\nFor-profit organizations and companies are explicitly prohibited from using this software for any purposes.\n\nRental. The licensee may not rent or lease FreeSurfer.\n\nCommercial Use. The licensee may not charge anyone for any activity that uses FreeSurfer. For example, the licensee may not charge for segmentation, quantification, and/or corticalsurface reconstruction using FreeSurfer. The licensee cannot charge others for installation of the software, nor can they pay any entity, other than a full-time employee, to install and operate the software. The licensee may not incorporate FreeSurfer or any of its parts into any commercial code or product of any kind.\n\nSoftware Transfer. The licensee may not transfer FreeSurfer to any third party.\n\nClinical Use: This software may not and should never be used for clinical purposes. Software used for clinical purposes may require regulatory documentation and associated filings.\n\nTermination. Without prejudice to any other rights, CorTechs Labs, Inc. may terminate this EULA if the licensee fails to comply with the terms and conditions of this EULA. In such an event, the licensee must destroy all copies of FreeSurfer and all of its component parts.\n\n3. COPYRIGHT and TRADEMARKS. FreeSurfer. All title and copyrights in and to FreeSurfer (including but not limited to any code, documentation, images, text or data) are owned by CorTechs Labs, Inc. and The General Hospital Corporation doing business as Massachusetts General Hospital. FreeSurfer is protected by copyright laws and international copyright treaties, as well as other intellectual property laws and treaties. FreeSurfer is licensed, not given away or sold. Trademarks. This License does not grant any rights to use the trade names \"FreeSurfer\", \"CorTechs Labs, Inc.\", \"CorTechs\", \"CSurf,\" “Massachusetts General Hospital” or any other trademarks or trade names belonging to CorTechs Labs, Inc. or The General Hospital Corporation unless explicitly permitted in writing by CorTechs Labs, Inc. or The General Hospital Corporation, respectively.\n\nTck/Tk. Parts of this software are based on the Tcl/Tk software copyrighted by the Regents of the University of California, Sun Microsystems, Inc., and other parties. The original license terms of the Tcl/Tk software distribution is included in the file docs/license.tcltk. (Please see Appendix 1)\n\nTix. Parts of this software are based on the Tix software copyrighted by the Ioi Kim Lam, and Expert Interface Technologies. The original license terms of the Tix software distribution is included in the file docs/license.tix. (Please see Appendix 2)\n\nHTML. Parts of this software are based on the HTML Library software copyrighted by Sun Microsystems, Inc. The original license terms of the HTML Library software distribution is included in the file docs/license.html_lib. (Please see Appendix 2)\n\nMesa. Parts of this software link to the Mesa library software copyrighted by Brian Paul. This software is covered under the GNU LIBRARY GENERAL PUBLIC LICENSE, Version 2, which is included in the file docs/license.gnu. (Please see Appendix 3)\n\n4. NO SUPPORT OR WARRANTY. FreeSurfer is provided with no support whatsoever. CorTechs Labs, Inc. and/or The General Hospital Corporation may, at their sole discretion, provide bug reports or upgrades at www.nmr.mgh.harvard.edu, but CorTechs and/or The General Hospital Corporation do not have any obligation to notify users of this occurring. FreeSurfer may contain in whole or in part pre-release, untested, or not fully tested works. FreeSurfer may contain errors that could cause failures or loss of data, and may be incomplete or contain inaccuracies. LICENSEE expressly acknowledges and agrees that use of FreeSurfer, or any portion thereof, is at LICENSEE's sole and entire risk, and that FreeSurfer is an experimental program. FreeSurfer is provided \"AS IS\" and without warranty, upgrades or support of any kind. CORTECHS LABS, INC. and THE GENERAL HOSPITAL CORPORATION EXPRESSLY DISCLAIMS ALL WARRANTIES AND/OR CONDITIONS, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY OR SATISFACTORY QUALITY AND FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. CORTECHS LABS, INC. AND THE GENERAL HOSPITAL CORPORATIN DO NOT WARRANT THAT THE FUNCTIONS CONTAINED IN FREESURFER WILL MEET LICENSEE'S REQUIREMENTS, OR THAT THE OPERATION OF FREESURFER WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT DEFECTS IN FREESURFER WILL BE CORRECTED. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY CORTECHS LABS, INC.OR THE GENERAL HOSPITAL CORPORATION OR A CORTECHS LABS, INC. AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY OR IN ANY WAY INCREASE THE SCOPE OF THIS WARRANTY. LICENSEE ACKNOWLEDGES THAT FREESURFER IS NOT INTENDED FOR CLINICAL USE AND SHOULD NOT BE USED FOR DIAGNOSIS, TREATMENT PLANNING, OR ANY OTHER CLINICAL PURPOSE.\n\n5. INFRINGEMENT. If any portion of, or functionality implemented by, FreeSurfer becomes the subject of a claim of infringement, CorTechs Labs, Inc. may, at its option: (a) attempt to procure the rights necessary for CorTechs Labs, Inc. and LICENSEE to continue using the Affected Code; (b) modify the Affected Code so that it is no longer infringing; or (c) suspend LICENSEE's rights to use, reproduce, modify, sublicense and distribute the Affected Code until a final determination of the claim is made by a court or governmental administrative agency of competent jurisdiction and CorTechs Labs, Inc. lifts the suspension as set forth below. Such suspension of rights will be effective immediately upon CorTechs Labs, Inc.'s posting of an email notice to such effect to the LICENSEE. Upon such final determination being made, if CorTechs Labs, Inc. is legally able, without the payment of a fee or royalty, to resume use, reproduction, modification, sublicensing and distribution of the Affected Code, CorTechs Labs, Inc. may, it CorTechs' sole discretion, lift the suspension of rights to the Affected Code by posting of an email notice to such effect to the LICENSEE.\n\nLICENSEE: agrees to release and to indemnify CorTechs Labs, Inc. and The General Hospital Corporation and any of their trusties, directors, employees, professional staff or agents from any and all claims and damages in any way arising from the use of FreeSurfer by you, your Institution, or any other individual or entity obtaining access to FreeSurfer from you or your institution.\n\n6. LIMITATION OF LIABILITY. UNDER NO CIRCUMSTANCES SHALL CORTECHS LABS, INC AND THE GENERAL HSOPITAL CORPORATION BE LIABLE FOR ANY INCIDENTAL, SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR RELATING TO THIS LICENSE OR LICENSEE'S USE OR INABILITY TO USE FREESURFER, OR ANY PORTION THEREOF, whether under a theory of contract, warranty, tort (including negligence), products liability or otherwise, even if CorTechs Labs, Inc. has been advised of the possibility of such damages AND NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY REMEDY. In no event shall CorTechs Labs, Inc.'s total liability to LICENSEE for all damages under this License exceed the amount of fifty dollars ($50.00).\n\n7. MISCELLANEOUS. U.S. Government End Users. The Covered Code is a \"commercial item\" as defined in FAR 2.101. Government software and technical data rights in the Covered Code include only those rights customarily provided to the public as defined in this License. This customary commercial license in technical data and software is provided in accordance with FAR 12.211 (Technical Data) and 12.212 (Computer Software) and, for Department of Defense purchases, DFAR 252.227-7015 (Technical Data -- Commercial Items) and 227.7202-3 (Rights in Commercial Computer Software or Computer Software Documentation). Accordingly, all U.S. Government End Users acquire Covered Code with only those rights set forth herein. Waiver; Construction. Failure by CorTechs Labs, Inc. to enforce any provision of this License will not be deemed a waiver of future enforcement of that or any other provision. Any law or regulation which provides that the language of a contract shall be construed against the drafter will not apply to this License. Dispute Resolution. Any litigation or other dispute resolution between LICENSEE and CorTechs Labs, Inc. relating to this License shall take place in the Commonwealth of Massachusetts, and LICENSEE and CorTechs Labs, Inc. hereby consent to the personal jurisdiction of, and venue in, the state and federal courts within that Commonwealth with respect to this License. The application of the United Nations Convention on Contracts for the International Sale of Goods is expressly excluded. Entire Agreement; Governing Law. This License constitutes the entire agreement between the parties with respect to the subject matter hereof. This License shall be governed by the laws of the United States and the Commonwealth of Massachusetts, except that body of Massachusetts law concerning conflicts of law.\n\nQuebec. Where LICENSEEs are located in the province of Quebec, Canada, the following clause applies: The parties hereby confirm that they have requested that this License and all related documents be drafted in English. Les parties ont exigé que le présent contrat et tous les documents connexes soient rédigés en anglais. Authority. The person submitting this registration warrants that he/she has the authority to bind to this Agreement the party which he/she represents.",
                    "_id": "ReconAll_1",
                    "_name": "ReconAll",
                    "_package": "FreeSurfer",
                    "_version": "5.3.0",
                    "_description": "Performs all steps of the ReconAll process:\n    1.  Motion Correction and Conform\n    2.  NU (Non-Uniform intensity normalization)\n    3.  Talairach transform computation\n    4.  Intensity Normalization 1\n    5.  Skull Strip\n    6.  EM Register (linear volumetric registration)\n    7.  CA Intensity Normalization\n    8.  CA Non-linear Volumetric Registration \n    9.  Remove neck\n    10. EM Register, with skull\n    11. CA Label (Aseg: Volumetric Labeling) and Statistics\n    12. Intensity Normalization 2 (start here for control points)\n    13. White matter segmentation\n    14. Edit WM With ASeg\n    15. Fill (start here for wm edits)\n    16. Tessellation (begins per-hemisphere operations)\n    17. Smooth1\n    18. Inflate1\n    19. QSphere\n    20. Automatic Topology Fixer\n    21. Final Surfs (start here for brain edits for pial surf)\n    22. Smooth2\n    23. Inflate2\n    24. Cortical Ribbon Mask\n    25. Spherical Mapping\n    26. Spherical Registration \n    27. Spherical Registration, Contralater hemisphere\n    28. Map average curvature to subject\n    29. Cortical Parcellation (Labeling)\n    30. Cortical Parcellation Statistics\n    31. Cortical Parcellation mapped to ASeg",
                    "_icon": "0",
                    "_posX": "348",
                    "_posY": "182",
                    "_rotation": "1",
                    "_sourceCode": "",
                    "_location": "pipeline://cranium.loni.usc.edu/recon-all.sh"
                }
            ],
            "variables": {
                "variable": [
                    {
                        "_name": "TestCDR",
                        "__text": "//idaxs/project/subject/study/weightKg"
                    },
                    {
                        "_name": "Var 1",
                        "__text": "Value"
                    },
                    {
                        "_name": "Var sasasa2",
                        "__text": "Value"
                    },
                    {
                        "_name": "CDRSCORE",
                        "__text": "//idaxs/project/subject/visit/assessment[@name='CDR']/component[@name='CDR Total Score']/assessmentScore[@attribute='CDGLOBAL']"
                    },
                    {
                        "_name": "MMSCORE",
                        "__text": "//idaxs/project/subject/visit/assessment[@name='MMSE']/component[@name='MMSE Total Score']/assessmentScore[@attribute='MMSCORE']"
                    },
                    {
                        "_name": "y",
                        "__text": "//idaxs/project/subject/study/subjectAge"
                    },
                    {
                        "_name": "SUID",
                        "__text": "//idaxs/project/subject/subjectIdentifier"
                    },
                    {
                        "_name": "Age",
                        "__text": "//idaxs/project/subject/study/subjectAge"
                    },
                    {
                        "_name": "age",
                        "__text": "//idaxs/project/subject/study/subjectAge"
                    }
                ]
            },
            "_id": "FreeSurferAutoSurfaceExtractor_1",
            "_name": "FreeSurfer Auto Surface Extractor",
            "_package": "FreeSurfer",
            "_icon": "0",
            "_posX": "0",
            "_posY": "0",
            "_sourceCode": ""
        },
        "_version": ".2"
    }
}

export default algo;