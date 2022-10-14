export const fakeTemplate = [
  {
    'id': 4,
    'name': 'jk002',
    'description': 'jk002',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 2,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'asdf',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': {
        'aaa': '2',
        'bbb': '3'
      },
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvisyoyoyo/ddd:2',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1aaa': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 1,
            'memoryMB': 1024,
            'ports': {
              'aaa': 3,
              'bbb': 4,
              'ccc': 2
            }
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'cpu'
      },
      'extras': {
        'virtualGroup': 'llll',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1aaa': {
              'skuNum': null,
              'skuType': null,
              'pinnedCellId': 'NODE-103-cpu',
              'affinityGroupName': null
            }
          }
        },
        'nfsList': [
          {
            'name': 'qwer',
            'mountPoint': '/root/qwer'
          },
          {
            'name': 'herer',
            'mountPoint': '/root/herer'
          }
        ],
        'glusterfsList': [
          {
            'name': 'qqqqerqwewqe',
            'mountPoint': '/root/qqqqerqwewqe'
          },
          {
            'name': 'tom',
            'mountPoint': '/root/tom'
          }
        ],
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 5,
    'name': 'qqqq',
    'description': 'wwww',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'qqqq',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvisddd/yoyoyo:1',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 1,
            'memoryMB': 1024,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'cpu'
      },
      'extras': {
        'virtualGroup': 'llll',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': 'cpu',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 6,
    'name': 'aaaa',
    'description': 'sss',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'aaa',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/ben/jason:666',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'Task_role_1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': '192.168.0.159/ben/jason:666',
          'resourcePerInstance': {
            'gpu': 1,
            'cpu': 6,
            'memoryMB': 20480,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'Task_role_1': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 8,
    'name': 'ssss',
    'description': 'sss',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'sssss',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/admin/test:demo4',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'Taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 1,
            'memoryMB': 1024,
            'ports': {
              'aaa': 3,
              'ddd': 4
            }
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'cpu'
      },
      'extras': {
        'virtualGroup': 'llll',
        'hivedScheduler': {
          'taskRoles': {
            'Taskrole1': {
              'skuNum': null,
              'skuType': 'cpu',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 9,
    'name': 'jk001',
    'description': 'jk001',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1jk',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvistest/w:qw',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1jkiiiaassa': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 1,
            'cpu': 6,
            'memoryMB': 20480,
            'ports': {
              'aaa': 1
            }
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1jkiiiaassa': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 10,
    'name': 'jjjj',
    'description': 'jjjj',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1jjjj',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': {
        'ddd': '3'
      },
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvis/elvisqq:q',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        },
        {
          'uri': '192.168.0.159/elvistest/w:qw',
          'name': 'docker_image_1',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole2': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 1,
            'memoryMB': 1024,
            'ports': {
              'aaa': 3,
              'vvv': 4
            }
          },
          'commands': [
            'sleep infinity'
          ]
        },
        'taskrole1aaaa': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_1',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 1,
            'memoryMB': 1024,
            'ports': {
              'ds': 3
            }
          },
          'commands': [
            'sleep infinity',
            'ls',
            '',
            'cd',
            'aaa'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'cpu'
      },
      'extras': {
        'virtualGroup': 'llll',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole2': {
              'skuNum': null,
              'skuType': null,
              'pinnedCellId': 'NODE-103-cpu',
              'affinityGroupName': null
            },
            'taskrole1aaaa': {
              'skuNum': null,
              'skuType': 'cpu',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': [
          {
            'name': 'xfsquaota',
            'mountPoint': '/root/xfsquaota'
          }
        ],
        'glusterfsList': [
          {
            'name': 'qqqqerqwewqe',
            'mountPoint': '/root/qqqqerqwewqe'
          }
        ],
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 11,
    'name': 'elvis12345',
    'description': 'elvis',
    'owner': 'elvis',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole112',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': {
        'test1': '2'
      },
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvistest/w:qw',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': '192.168.0.159/elvistest/w:qw',
          'resourcePerInstance': {
            'gpu': 1,
            'cpu': 6,
            'memoryMB': 20480,
            'ports': {
              'myport': 1
            }
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': [
          {
            'name': 'ass',
            'mountPoint': '/root/ass'
          }
        ],
        'glusterfsList': [
          {
            'name': 'qqqqerqwewqe',
            'mountPoint': '/root/qqqqerqwewqe'
          }
        ],
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 12,
    'name': 'xxx',
    'description': 'xxx',
    'owner': 'elvis',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvisyoyoyo/ddd:2',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': '192.168.0.159/elvisyoyoyo/ddd:2',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 0,
            'memoryMB': 0,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': [
          {
            'name': 'newnew',
            'mountPoint': '/root/newnew'
          }
        ],
        'glusterfsList': null,
        'xdfsList': [
          {
            'name': 'newnew',
            'mountPoint': '/root/newnew'
          }
        ]
      },
      'deployments': null
    }
  },
  {
    'id': 13,
    'name': 's',
    'description': 'a',
    'owner': 'elvis',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvisddd/yoyoyo:2',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': '192.168.0.159/elvisddd/yoyoyo:2',
          'resourcePerInstance': {
            'gpu': 2,
            'cpu': 12,
            'memoryMB': 40960,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 14,
    'name': 'jacktest',
    'description': 'test',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/jack/ubuntu:16.04',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': '192.168.0.159/jack/ubuntu:16.04',
          'resourcePerInstance': {
            'gpu': 1,
            'cpu': 6,
            'memoryMB': 20480,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': [
          {
            'name': 'test',
            'mountPoint': '/root/test'
          }
        ],
        'glusterfsList': [
          {
            'name': 'qqqqqqq',
            'mountPoint': '/root/qqqqqqq'
          }
        ],
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 15,
    'name': 'dddddd',
    'description': 'dddddsss',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvistest/w:qw',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 0,
            'memoryMB': 0,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'rtx2080ti'
      },
      'extras': {
        'virtualGroup': 'nick',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': 'rtx2080ti',
              'pinnedCellId': null,
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 16,
    'name': 'jacktest1',
    'description': '',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/jack/ttestest:latest',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskrole1': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 0,
            'cpu': 1,
            'memoryMB': 1024,
            'ports': null
          },
          'commands': [
            'sleep infinity'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'cpu'
      },
      'extras': {
        'virtualGroup': 'llll',
        'hivedScheduler': {
          'taskRoles': {
            'taskrole1': {
              'skuNum': null,
              'skuType': null,
              'pinnedCellId': 'NODE-103-cpu',
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  },
  {
    'id': 17,
    'name': 'test_odin',
    'description': '',
    'owner': 'admin',
    'canReadUsers': [],
    'canWriteUsers': [],
    'publicMode': 0,
    'jobConfig': {
      'protocolVersion': '2',
      'name': 'taskrole1',
      'type': 'job',
      'jobRetryCount': 0,
      'parameters': null,
      'prerequisites': [
        {
          'uri': '192.168.0.159/elvistest/rrrr:1',
          'name': 'docker_image_0',
          'type': 'dockerimage'
        }
      ],
      'taskRoles': {
        'taskRoleOdin': {
          'instances': 1,
          'completion': {
            'minFailedInstances': 1,
            'minSucceededInstances': 1
          },
          'taskRetryCount': 0,
          'dockerImage': 'docker_image_0',
          'resourcePerInstance': {
            'gpu': 1,
            'cpu': 8,
            'memoryMB': 59505,
            'ports': null
          },
          'commands': [
            'sleep infinity',
            'cd'
          ]
        }
      },
      'defaults': {
        'virtualCluster': 'default'
      },
      'extras': {
        'virtualGroup': 'test',
        'hivedScheduler': {
          'taskRoles': {
            'taskRoleOdin': {
              'skuNum': null,
              'skuType': null,
              'pinnedCellId': 'NODE-103',
              'affinityGroupName': null
            }
          }
        },
        'nfsList': null,
        'glusterfsList': null,
        'xdfsList': null
      },
      'deployments': null
    }
  }
]

export const fakeUserList = [
  {
    'username': 'admin',
    'userCode': null,
    'name': null,
    'email': null,
    'phone': null,
    'description': null,
    'roles': [
      'admin'
    ],
    'privileges': [
      'ADMIN'
    ],
    'state': 1,
    'leaderGroups': [
      'system',
      'qwe'
    ],
    'userGroups': [
      'system'
    ],
    'virtualGroups': [
      'nick',
      'nick2',
      'test',
      'rtx'
    ],
    'nfsList': [
      'ass',
      'xfsquota3',
      'ABC',
      'nfs2',
      'qwer',
      'test222',
      'sdsdsd',
      'admin',
      'elvis',
      'xfsquaota',
      'dododo'
    ],
    'glusterfsList': [
      'qqqqqqq',
      'glusterfs'
    ],
    'xdfsList': [
      'xdfs',
      'admin'
    ],
    'lastSigninDate': 1637903529658,
    'grouplist': [
      'default',
      'admingroup'
    ],
    'extension': {},
    'admin': true,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'atest',
    'userCode': '33',
    'name': 'a',
    'email': 'a@mail.com',
    'phone': '011',
    'description': '',
    'roles': [
      'leader',
      'test',
      'glusterfs',
      'nfs',
      'user',
      'rrrrr',
      'USER',
      'key'
    ],
    'privileges': [
      'SYSTEM',
      'GLUSTERFS',
      'NFS',
      'USER',
      'JOB',
      'KEY'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [
      'system'
    ],
    'virtualGroups': [
      'nick2',
      'nick',
      'llll',
      'test',
      'rtx'
    ],
    'nfsList': [
      'atest'
    ],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1636077216856,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'ddddd',
    'userCode': '42895792',
    'name': '测',
    'email': 'ddddd@gmail.com',
    'phone': '32847238907',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [
      'ddddd'
    ],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'dodo',
    'userCode': '1234567890',
    'name': 'dodo',
    'email': 'dodo@gmail.com',
    'phone': '1234567890',
    'description': '',
    'roles': [
      'glusterfs'
    ],
    'privileges': [
      'GLUSTERFS'
    ],
    'state': 1,
    'leaderGroups': [
      'qwewwww'
    ],
    'userGroups': [],
    'virtualGroups': [
      'twtwtwtwtw'
    ],
    'nfsList': [
      'ass',
      'qwer'
    ],
    'glusterfsList': [
      'gjgj',
      'uuuuuuuqqqqqq'
    ],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'dododo',
    'userCode': '1123456789913',
    'name': 'dododo',
    'email': 'dododo@gmail.com',
    'phone': '3764871699',
    'description': '',
    'roles': [
      'glusterfs',
      'nfs',
      'user',
      'key'
    ],
    'privileges': [
      'GLUSTERFS',
      'NFS',
      'JOB',
      'KEY'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [
      'system'
    ],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [
      'jack'
    ],
    'lastSigninDate': 1629422335636,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'elvis',
    'userCode': '27184691649831',
    'name': 'elvis',
    'email': 'elvis6661056@gmail.com',
    'phone': '3017583750',
    'description': '',
    'roles': [
      'nfs',
      'user'
    ],
    'privileges': [
      'NFS',
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [
      'elvis'
    ],
    'glusterfsList': [],
    'xdfsList': [
      'yuyuyu'
    ],
    'lastSigninDate': 1637306959696,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'gyl07',
    'userCode': 'sdgfhsgdh',
    'name': 'gsfdgsfdg',
    'email': 'gsfygsf@aiserver.cn',
    'phone': '2153621526',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 0,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [
      'user1'
    ],
    'xdfsList': [],
    'lastSigninDate': 1631068667544,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jack',
    'userCode': '123454321',
    'name': 'Jack',
    'email': 'jackgold1989@hotmail.com',
    'phone': '0912345678',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'nick',
      'nick2',
      'llll',
      'test',
      'twtwtwtwtw'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [
      'jack'
    ],
    'lastSigninDate': 1635410871992,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jacktest',
    'userCode': '1234565432',
    'name': 'abababa',
    'email': '12423@ggg33.xx',
    'phone': '125356',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [
      'system'
    ],
    'userGroups': [],
    'virtualGroups': [
      'nick',
      'nick2',
      'llll',
      'rtx'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1630397457166,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jk004',
    'userCode': '004',
    'name': 'jk004',
    'email': 'jk004@gmail.com',
    'phone': '098765432',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 0,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1631585179947,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jkjk01',
    'userCode': '112928443',
    'name': 'jkjk01',
    'email': 'genius@example.com',
    'phone': '1334567890',
    'description': '备注',
    'roles': [
      'USER'
    ],
    'privileges': [
      'USER'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jkjk03',
    'userCode': '3131434',
    'name': 'jkjk03',
    'email': 'jkjk02@gmail.com',
    'phone': '32424245',
    'description': '备注',
    'roles': [
      'USER'
    ],
    'privileges': [
      'USER'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jkjkjk',
    'userCode': '3284782374',
    'name': 'jkjkjk',
    'email': 'jkjkjk@gmail.com',
    'phone': '3207803250',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [
      'sdsdsd'
    ],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1630047653222,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'jojo',
    'userCode': '01',
    'name': 'j',
    'email': 'mail@mail.com',
    'phone': '09',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 0,
    'leaderGroups': [
      'qwewwww'
    ],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1637118474602,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'newadmin',
    'userCode': '2324354544',
    'name': 'fgjldjlsjflkdsjgkldjfkls',
    'email': 'newadmin@gmail.com',
    'phone': '12293754384983298',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1628672965286,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'nick',
    'userCode': '105552010',
    'name': '莊翔甯',
    'email': 'andy345694@gmail.com',
    'phone': '0988835505',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [
      'system'
    ],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [
      'nick',
      'test'
    ],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1637743480064,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'nickfortest',
    'userCode': '22324334353434343434',
    'name': '你好我是尼克',
    'email': 'idonotwanttotellyou@gmail.com',
    'phone': '2329048394839890483984398403',
    'description': '3243434545454',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'nicktest',
    'userCode': '12132434343544',
    'name': 'kjlkfjjkjfkgjfkgfklgj',
    'email': 'nicktest@gmail.com',
    'phone': '909293829849384938',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [
      'system'
    ],
    'userGroups': [],
    'virtualGroups': [
      'nick',
      'nick2',
      'rtx'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1628672099839,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'normal',
    'userCode': '3132434345445',
    'name': '我是一隻魚',
    'email': 'testtstetetst@gmail.com',
    'phone': '0903489378734983209',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [
      'normal'
    ],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1637313348839,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'odin3',
    'userCode': '32850205904',
    'name': 'odin33',
    'email': 'odin@gmail.com',
    'phone': '245249924580',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [
      'system',
      'qwewwww'
    ],
    'virtualGroups': [
      'test',
      'twtwtwtwtw'
    ],
    'nfsList': [
      'odin3'
    ],
    'glusterfsList': [
      'odin3'
    ],
    'xdfsList': [],
    'lastSigninDate': 1637826247895,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qaz',
    'userCode': '9245892',
    'name': 'qaz',
    'email': 'qaz@gmail.com',
    'phone': '23587709',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qqqqq',
    'userCode': '289492',
    'name': 'qqqqq',
    'email': 'qqqqq@gmail.com',
    'phone': '4829489289',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'twtwtwtwtw'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [
      'qqqqq'
    ],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qqqqqq',
    'userCode': '3289529',
    'name': 'qqqqqq',
    'email': 'qqqqqq@gmail.com',
    'phone': '2857829370',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [
      'qqqqqq'
    ],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qw',
    'userCode': '213431415',
    'name': 'qw',
    'email': 'qw@gmail.com',
    'phone': '319057103570',
    'description': '',
    'roles': [
      'admin'
    ],
    'privileges': [
      'ADMIN'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default',
      'admingroup'
    ],
    'extension': {},
    'admin': true,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qwer',
    'userCode': '239875982',
    'name': 'qwer',
    'email': 'qwer@gmail.com',
    'phone': '583720472',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [
      'qwer'
    ],
    'glusterfsList': [
      'nick',
      'gygy',
      'test22',
      'eeee'
    ],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qwert',
    'userCode': 'qwert',
    'name': 'qwert',
    'email': 'qwert@gmail.com',
    'phone': '913078504270',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [
      'qwe'
    ],
    'userGroups': [
      'system',
      'qwe'
    ],
    'virtualGroups': [
      'nick',
      'llll',
      'test'
    ],
    'nfsList': [
      'qwer'
    ],
    'glusterfsList': [
      'test22',
      'gjgj',
      'try'
    ],
    'xdfsList': [],
    'lastSigninDate': 1628836070797,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'qwerty',
    'userCode': '834278934728',
    'name': 'qwerty',
    'email': 'qwerty@gmail.com',
    'phone': '53729054370',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'robi',
    'userCode': 'c2539',
    'name': 'robi',
    'email': 'c2539@gmail.com',
    'phone': '023939889',
    'description': '',
    'roles': [
      'leader'
    ],
    'privileges': [
      'GLUSTERFS',
      'NFS',
      'USER',
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'test',
    'userCode': '1234567',
    'name': 'Test',
    'email': 'test@xx',
    'phone': '09123456789',
    'description': null,
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [
      'qwe'
    ],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [
      'nfs',
      'dododo'
    ],
    'glusterfsList': [
      'qqqqerqwewqe',
      'test',
      'uuuuuuuqqqqqq'
    ],
    'xdfsList': [],
    'lastSigninDate': 1635755917250,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'test6666',
    'userCode': '128728472398',
    'name': 'kfdjkfjdkjfkdjfkldjf',
    'email': 'testteset@gmail.com',
    'phone': '903920392983948',
    'description': 'dffdfd',
    'roles': [],
    'privileges': [],
    'state': 0,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1633596931824,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'testestssdfsdf',
    'userCode': 'sf4aefeq3',
    'name': 'adsf3d',
    'email': 'asdf@ff.ss',
    'phone': '25347324',
    'description': '',
    'roles': [
      'user'
    ],
    'privileges': [
      'JOB'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'nick'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'tttt',
    'userCode': '843578094375',
    'name': 'tttt',
    'email': 'tttt@gmail.com',
    'phone': '40927850943820',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'user01',
    'userCode': 'a12345678',
    'name': 'YourName',
    'email': 'test@example.com',
    'phone': '98948958965865989458',
    'description': 'description',
    'roles': [
      'test'
    ],
    'privileges': [
      'USER'
    ],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'test'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'wwqq',
    'userCode': '49823492',
    'name': 'wwqq',
    'email': 'wwqq@gmail.com',
    'phone': '3289289',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'twtwtwtwtw'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [
      'wwqq'
    ],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'wwww',
    'userCode': '285973295794',
    'name': 'wwww',
    'email': 'wwww@gmail.com',
    'phone': '4835937495',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': -1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [],
    'lastSigninDate': 1628825226283,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  },
  {
    'username': 'yuyuyu',
    'userCode': '4898439',
    'name': 'yuyuyu',
    'email': 'yuyuyu@gmail.com',
    'phone': '4384938493',
    'description': '',
    'roles': [],
    'privileges': [],
    'state': 1,
    'leaderGroups': [],
    'userGroups': [],
    'virtualGroups': [
      'twtwtwtwtw'
    ],
    'nfsList': [],
    'glusterfsList': [],
    'xdfsList': [
      'yuyuyu'
    ],
    'lastSigninDate': null,
    'grouplist': [
      'default'
    ],
    'extension': {},
    'admin': false,
    'virtualCluster': [
      'default',
      'cpu',
      'rtx2060',
      'rtx2080ti'
    ],
    'storageConfig': []
  }
]

export const fakeCanUseVg = [
  {
    'name': 'test',
    'resource': 'system',
    'cells': {
      'default.pinned.NODE-103': {
        'name': 'default.pinned.NODE-103',
        'resourceUnit': 'A6000',
        'number': 1
      }
    },
    'usedCells': null,
    'activeJobs': null,
    'users': [
      'normal',
      'nickfortest',
      'user01',
      'admin',
      'dododo',
      'jack',
      'nick',
      'qwert',
      'odin3',
      'jkjk03',
      'ddddd',
      'jkjk01',
      'tttt',
      'atest'
    ],
    'schedulable': true
  },
  {
    'name': 'twtwtwtwtw',
    'resource': '\b測試',
    'cells': {},
    'usedCells': null,
    'activeJobs': null,
    'users': [
      'odin3',
      'yuyuyu',
      'wwqq',
      'dodo',
      'qqqqq',
      'jack'
    ],
    'schedulable': false
  },
  {
    'name': 'llll',
    'resource': 'system',
    'cells': {
      'cpu.pinned.NODE-103-cpu': {
        'name': 'cpu.pinned.NODE-103-cpu',
        'resourceUnit': 'cpu',
        'number': 1
      },
      'cpu.virtual.cpu': {
        'name': 'cpu.virtual.cpu',
        'resourceUnit': 'cpu',
        'number': 1
      }
    },
    'usedCells': null,
    'activeJobs': null,
    'users': [
      'qwert',
      'jacktest',
      'jack',
      'atest'
    ],
    'schedulable': false
  },
  {
    'name': 'nick',
    'resource': 'nick',
    'cells': {
      'rtx2080ti.virtual.rtx2080ti': {
        'name': 'rtx2080ti.virtual.rtx2080ti',
        'resourceUnit': 'rtx2080ti',
        'number': 1
      }
    },
    'usedCells': null,
    'activeJobs': null,
    'users': [
      'qwert',
      'jacktest',
      'testestssdfsdf',
      'admin',
      'nicktest',
      'jack',
      'atest'
    ],
    'schedulable': false
  },
  {
    'name': 'nick2',
    'resource': 'nick',
    'cells': {
      'rtx2080ti.virtual.rtx2080ti': {
        'name': 'rtx2080ti.virtual.rtx2080ti',
        'resourceUnit': 'rtx2080ti',
        'number': 1
      }
    },
    'usedCells': null,
    'activeJobs': null,
    'users': [
      'jacktest',
      'admin',
      'nicktest',
      'jack',
      'atest'
    ],
    'schedulable': false
  },
  {
    'name': 'rtx',
    'resource': 'system',
    'cells': {
      'rtx2060.pinned.NODE-101': {
        'name': 'rtx2060.pinned.NODE-101',
        'resourceUnit': 'rtx2060',
        'number': 1
      }
    },
    'usedCells': null,
    'activeJobs': null,
    'users': [
      'jacktest',
      'admin',
      'nicktest',
      'atest'
    ],
    'schedulable': false
  }
]

export const fakeNfsInfo = [
  {
    'name': 'ass',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 0,
    'users': [
      'admin',
      'dodo'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 7168,
    'available': 922624,
    'errorMessage': null
  },
  {
    'name': 'ABC',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 1,
    'users': [
      'admin'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'newnew',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 1,
    'users': [],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'nfs2',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 0,
    'users': [
      'admin'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 145408,
    'available': 784384,
    'errorMessage': null
  },
  {
    'name': 'sdsdsd',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 1,
    'type': 0,
    'users': [
      'jkjkjk',
      'admin'
    ],
    'canReadUsers': [],
    'canWriteUsers': [
      'qwer'
    ],
    'used': 1024,
    'available': 929792,
    'errorMessage': null
  },
  {
    'name': 'qwer',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 0,
    'type': 0,
    'users': [
      'qwert',
      'qwer',
      'admin',
      'dodo'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 2048,
    'available': 928768,
    'errorMessage': null
  },
  {
    'name': 'test',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 1,
    'users': [
      'nick'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'herer',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 0,
    'users': [],
    'canReadUsers': [],
    'canWriteUsers': [
      'qwert',
      'test',
      'qw',
      'dodo'
    ],
    'used': 1024,
    'available': 929792,
    'errorMessage': null
  },
  {
    'name': 'admin',
    'nfsDisk': 'nfsDisk',
    'size': 10,
    'publicMode': 0,
    'type': 1,
    'users': [
      'admin'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 10485760,
    'errorMessage': null
  },
  {
    'name': 'xfsquaota',
    'nfsDisk': 'nfsDisk',
    'size': 50,
    'publicMode': 0,
    'type': 1,
    'users': [
      'admin'
    ],
    'canReadUsers': [
      'admin'
    ],
    'canWriteUsers': [
      'admin'
    ],
    'used': 2009088,
    'available': 50419712,
    'errorMessage': null
  },
  {
    'name': 'test222',
    'nfsDisk': 'nfsDisk',
    'size': 5,
    'publicMode': 0,
    'type': 1,
    'users': [
      'admin'
    ],
    'canReadUsers': [
      'jack'
    ],
    'canWriteUsers': [],
    'used': 0,
    'available': 5242880,
    'errorMessage': null
  },
  {
    'name': 'kkkk',
    'nfsDisk': 'nfsDisk',
    'size': 5,
    'publicMode': 2,
    'type': 1,
    'users': [],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 5242880,
    'errorMessage': null
  },
  {
    'name': 'xfsquota3',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 0,
    'type': 1,
    'users': [
      'admin'
    ],
    'canReadUsers': [
      'admin'
    ],
    'canWriteUsers': [
      'admin'
    ],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'dododo',
    'nfsDisk': 'nfsDisk',
    'size': 10,
    'publicMode': 0,
    'type': 0,
    'users': [
      'test',
      'admin'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 23552,
    'available': 9626624,
    'errorMessage': null
  },
  {
    'name': 'xfsquota2',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 2,
    'type': 1,
    'users': [],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'nick',
    'nfsDisk': 'nfsDisk',
    'size': 5,
    'publicMode': 0,
    'type': 0,
    'users': [
      'nick'
    ],
    'canReadUsers': [
      'admin'
    ],
    'canWriteUsers': [
      'admin'
    ],
    'used': 119808,
    'available': 4631552,
    'errorMessage': null
  },
  {
    'name': 'elvis',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 0,
    'type': 1,
    'users': [
      'admin',
      'elvis'
    ],
    'canReadUsers': [],
    'canWriteUsers': [],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'nfs',
    'nfsDisk': 'nfsDisk',
    'size': 1,
    'publicMode': 0,
    'type': 0,
    'users': [
      'test'
    ],
    'canReadUsers': [
      'test',
      'admin'
    ],
    'canWriteUsers': [
      'test',
      'admin'
    ],
    'used': 2048,
    'available': 928768,
    'errorMessage': null
  }
]

export const fakeGlusterFsInfo = [
  {
    'name': 'tom',
    'volume': 'volume',
    'size': 10.00,
    'publicMode': 1,
    'users': [],
    'canReadUsers': [],
    'canWriteUsers': [
      'dododo'
    ],
    'used': 0,
    'available': 10485760,
    'errorMessage': null
  },
  {
    'name': 'qqqqqqq',
    'volume': 'volume',
    'size': 2.00,
    'publicMode': 0,
    'users': [
      'admin'
    ],
    'canReadUsers': [
      'test',
      'admin',
      'dodo',
      'dododo'
    ],
    'canWriteUsers': [
      'test',
      'admin',
      'dodo',
      'dododo'
    ],
    'used': 0,
    'available': 1048576,
    'errorMessage': null
  },
  {
    'name': 'qqqqerqwewqe',
    'volume': 'volume',
    'size': 10.00,
    'publicMode': 1,
    'users': [
      'test'
    ],
    'canReadUsers': [],
    'canWriteUsers': [
      'test'
    ],
    'used': 0,
    'available': 10485760,
    'errorMessage': null
  },
  {
    'name': 'uuuuuuuqqqqqq',
    'volume': 'volume',
    'size': 10.00,
    'publicMode': 0,
    'users': [
      'test',
      'dodo'
    ],
    'canReadUsers': [
      'admin'
    ],
    'canWriteUsers': [
      'admin'
    ],
    'used': 0,
    'available': 10485760,
    'errorMessage': null
  },
  {
    'name': 'glusterfs',
    'volume': 'volume',
    'size': 2.00,
    'publicMode': 0,
    'users': [
      'admin'
    ],
    'canReadUsers': [
      'admin'
    ],
    'canWriteUsers': [
      'admin'
    ],
    'used': 360,
    'available': 2096792,
    'errorMessage': null
  }
]