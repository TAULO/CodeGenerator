const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const motorExaminationSchema = new Schema({
    date: {
        type: Date,
        required: false
    },

    //start 
    spine: {
        cervical: {
            type: String,
            required: false
        },
        thoraric: {
            type: String,
            required: false
        },
        lumbar: {
            type: String,
            required: false
        }

    },
    //end



    //start
    cervical: {
        flexion: {
            type: String,
            required: false
        },
        extension: {
            type: String,
            required: false
        },
        sideFlexion: {
            left: {
                type: String,
                required: false
            },
            right: {
                type: String,
                required: false
            }
        },
        rotation: {
            left: {
                type: String,
                required: false
            },
            right: {
                type: String,
                required: false
            }
        }

    },

    //end



    //start
    thoraric: {
        flexion: {
            type: String,
            required: false
        },
        extension: {
            type: String,
            required: false
        },
        sideFlexion: {
            left: {
                type: String,
                required: false
            },
            right: {
                type: String,
                required: false
            }
        },
        rotation: {
            left: {
                type: String,
                required: false
            },
            right: {
                type: String,
                required: false
            }
        }

    },


    //end



    //start
    lumbar: {
        flexion: {
            type: String,
            required: false
        },
        extension: {
            type: String,
            required: false
        },
        sideFlexion: {
            left: {
                type: String,
                required: false
            },
            right: {
                type: String,
                required: false
            }
        },
        rotation: {
            left: {
                type: String,
                required: false
            },
            right: {
                type: String,
                required: false
            }
        }

    },

    //end


    //start
    hip: {
        flexionIliopsoas: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionStartorius: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionRectus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionGluteus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        abductionGluteus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        abductionTens: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adductionAdductors: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extRotation: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        intRotation: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },

    },
    //end




    //start
    knee: {
        flexionMed: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionLat: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionGracilius: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionQuadriceps: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        }
    },
    //end



    //start
    ankle: {
        flexionGastrocneius: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionSoleus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionDorsi: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        inversion: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        eversion: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        }
    },
    //end




    //till here
    //start
    toes: {
        flexion: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extension: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },

        //end



        //start
        hallux: {
            flexionBrev: {
                left: {
                    row: {
                        type: String,
                        required: false
                    },
                    power: {
                        type: String,
                        required: false
                    },
                    tone: {
                        type: String,
                        required: false
                    }
                },
                right: {
                    row: {
                        type: String,
                        required: false
                    },
                    power: {
                        type: String,
                        required: false
                    },
                    tone: {
                        type: String,
                        required: false
                    }
                }
            },
            flexionLong: {
                left: {
                    row: {
                        type: String,
                        required: false
                    },
                    power: {
                        type: String,
                        required: false
                    },
                    tone: {
                        type: String,
                        required: false
                    }
                },
                right: {
                    row: {
                        type: String,
                        required: false
                    },
                    power: {
                        type: String,
                        required: false
                    },
                    tone: {
                        type: String,
                        required: false
                    }
                }
            },
            flexionExtLong: {
                left: {
                    row: {
                        type: String,
                        required: false
                    },
                    power: {
                        type: String,
                        required: false
                    },
                    tone: {
                        type: String,
                        required: false
                    }
                },
                right: {
                    row: {
                        type: String,
                        required: false
                    },
                    power: {
                        type: String,
                        required: false
                    },
                    tone: {
                        type: String,
                        required: false
                    }
                }
            }
        }

    },

    //end here





    //start
    scapula: {
        abduction: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        elevation: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adductionTraps: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        depression: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        pain: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adductionRhomboids: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        }
    },
    //end




    //start
    elbow: {
        FlexionBiceps: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexion: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extension: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        }
    },
    //end




    //start
    foreArm: {
        supinationBiceps: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        supinationSupinator: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        pronation: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        }
    },
    //end




    //start
    shoulder: {
        flexion: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extension: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        abductionSupra: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        abductionDeltoid: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adductionDelt: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adductionMajor: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extRotation: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        intRotation: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },

    },
    //end






    //start
    wrist: {
        flexionRad: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionUln: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionRad: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionUln: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        radialRad: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        radialLongus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        ulnarFlex: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        ulnarExt: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },

    },
    //end




    //start
    fingers: {
        flexionLumbricals: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionSup: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionProf: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extension: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adduction: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        abduction: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        }
    },
    //end




    //start
    thumb: {
        flexionBrevis: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionLongus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionBrevis: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionLongus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        adduction: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        abduction: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        opposition: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
    },
    //end




    //start
    hnAndt: {
        flexionSternoclenoid: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionExtensors: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        flexionRectus: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionDorsal: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        extensionLumbar: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        hipHike: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
        facialMovt: {
            left: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            },
            right: {
                row: {
                    type: String,
                    required: false
                },
                power: {
                    type: String,
                    required: false
                },
                tone: {
                    type: String,
                    required: false
                }
            }
        },
    },
    //end




    //start
    measurement: {
        asisToMedialMalleolus: {
            type: String,
            required: false
        },
        umblicusToMedialMalleolus: {
            type: String,
            required: false
        },
        midThighCircumference: {
            type: String,
            required: false
        },
        midCalfCircumference: {
            type: String,
            required: false
        }
    }

    //end


});

module.exports = new mongoose.model("MotorExamination", motorExaminationSchema);
