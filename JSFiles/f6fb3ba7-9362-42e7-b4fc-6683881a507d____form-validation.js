
$(function() {

    function getMsg(selector) {
    return $(selector).attr('data-msg');
}

	$("#add_hospital").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
         remote: {
          url: "admin/check_email_exist_validation",
          type: "post"
        }
      },
    //   contact: {
    //     required: true,
    //     number: true,
    //     remote: {
    //       url: "admin/check_contact_exist_validation",
    //       type: "post"
    //     }
    //   },
       logo: {
        required:true,
      },
      address:{
        required:true,
      },
      lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      opening_time:{
        required:true,
      },
      closing_time:{
        required:true,
      },
      description:{
        required:true,
      },
       'speciality[]':{
        required:true,
      },
      bed:{
         number: true,
      },
      contact_person: {
        required: true,
        number:true
      },
      fee: {
        
        number:true,
      },
      'departments[]':{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Id already exists"
      },
    //   contact: {
    //     required: "Please enter contact number",
    //     number: "please enter digit only",
    //      remote: "contact number already exists"
    //   },
       logo: {
        required:"Please select logo ",
      },
      address:{
        required:"Please enter address",
      },
      lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only",
      },
      opening_time:{
        required:"Please select opening time",
      },
      closing_time:{
        required:"Please select closing time",
      },
      description:{
        required:"Please enter discription",
      },
       'speciality[]':{
        required:"Please select speciality",
      },
       bed:{
         number: "Please enter digit only",
      },
      contact_person: {
        required: "Please enter contact number",
        number: "please enter digit only",
      },
       fee: {
        
       number: "please enter digit only",
      },

      'departments[]':{
        required:"Please select departments",
      }
  }
  });

  $("#edit_hospital").validate({
    rules: {
      name: {
        required:true,
      },
      owner_name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true,
        number:true
      },
      contact: {
        required: true,
        number: true
      },
      emergency_service: {
        required: true
      },
      lab_facility: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      information:{
        required:true,
      },
       'speciality[]':{
        required:true,
      },
       bed:{
         number: true,
      },
       fee:{
         number: true,
      },
      'departments[]':{
        required: true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      owner_name: {
          required: "Please enter owner name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_person: {
        required: "Please enter contact person",
          number: "please enter digit only"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      lab_facility:{
        required:"Please select Lab Facility"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      information:{
        required:"Please enter Other Information"
      },
      'speciality[]':{
        required:"Please select speciality",
      },
       bed:{
         number: "Please enter digit only",
      },
       fee:{
         number: "Please enter digit only",
      },
      'departments[]':{
        required:"Please select departments",
      }
  }
  });




  $("#edit_hospital_profile").validate({
    rules: {
      name: {
        required:true,
      },
      owner_name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true,
        number: true
      },
      contact: {
        required: true,
        number: true
      },
       contact_2: {
        number: true,
      },
       contact_3: {
        number: true,
      },

      emergency_service: {
        required: true
      },
      lab_facility: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      fee_type:{
        required:true,
      },
      fee:{
        required:true,
        number:true,
      },
      information:{
        required:true,
      },
      'speciality[]':{
        required:true,
      },
       bed:{
         number: true,
      },
      'departments[]':{
        required:true,
      }

    },
    messages: {
      name: {
          required: "Please enter name",
      },
      owner_name: {
          required: "Please enter owner name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_2: {
        number: "please enter digit only",
      },
      contact_3: {
        number: "please enter digit only",
      },

      contact_person: {
        required: "Please enter contact person",
         number: "please enter digit only"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      lab_facility:{
        required:"Please select Lab Facility"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select enter valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      fee_type:{
        required:"Please select fee type",
      },
      fee:{
        required:"Please enter fee",
        number:"Please enter only digit",
      },

      information:{
        required:"Please enter Other Information",
      },
      'speciality[]':{
        required:"Please select speciality",
      },
       bed:{
         number: "Please enter digit only",
      },
      'departments[]':{
        required:"Please select departments",
      }
  }
  });

///////////Add LAB //////////////

  $("#add_lab").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "admin/check_email_exist_validation",
          type: "post"
        }
      },
      password: {
        required: true,
        minlength: 5
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true,
        remote: {
          url: "admin/check_contact_exist_validation",
          type: "post"
        }
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      // 'tests[]':{
      //   required:true,
      // },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Already Exist!"
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only",
        remote: "Contact number Already Exist!"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },

      description:{
        required:"Please enter discription",
      },
      //  'tests[]':{
      //   required:"Please select at least one test",
      // },
      information:{
        required:"Please enter Other Information"
      }
  }
  });




  ////////////////////add_stocl//////////////////////////
    $("#add_stock").validate({
    rules: {
      quantity: {
        required:true,
        number:true,
      },
      note:{
        required:true,

      }
    },
    messages: {
      quantity: {
        required:"Please enter Quantity",
        number:"Please enter valid quantity",
      },
      note:{
        required:"Please enter note",
      }
  }
  });


///////////////////edit stock///////////////

$("#edit_stock_data").validate({
    rules: {
      quantity: {
        required:true,
        number:true,
      },
      note:{
        required:true,
      }
    },
    messages: {
      quantity: {
        required:"Please enter Quantity",
        number:"Please enter valid quantity",
      },
      note:{
        required:"Please enter note",
      }
  }
  });

///////////Add LAB //////////////
///////////EDIT LAB //////////////
  $("#edit_lab").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
      lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
      lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////EDIT LAB //////////////
//////////// ADD DOCTOR /////////////


  $("#add_doctor").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "admin/check_email_exist_validation",
          type: "post"
        }
      },
      password: {
        required: true,
        minlength: 5
      },
      contact_person: {
        required: true,
         number: true,
        remote: {
          url: "admin/check_contact_exist_validation",
          type: "post"
        }
      },
      contact: {
        required: true,
        number: true
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
       doctor_department:{
        required:true,
      },
       'speciality[]':{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Already Exist!"
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only",
        remote: "Contact number Already Exist!"

      },
      contact_person: {
        required: "Please enter contact person",
        number:"Please enter digit only"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
       doctor_department:{
        required:"Please select department",
      },
      'speciality[]':{
        required:"Please select speciality",
      },

      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////Add DOCTOR //////////////
///////////EDIT DOCTOR //////////////
  $("#edit_doctor").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true,
        
      },
      contact: {
        required: true,
        number: true
      },
       contact_2: {
        number: true,
      },
       contact_3: {
        number: true,
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      fee:{
        required:true,
        number:true,
      },
       file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_2: {
       number: "please enter digit only",
      },
      contact_3: {
       
        number: "please enter digit only",
      },
      contact_person: {
        required: "Please enter contact person name",
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      fee:{
        required:"Please enter fee",
        number:"Please enter valid fee",
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////EDIT DOCTOR //////////////


////////////  ADD Pharmacy ////////////


  $("#add_pharmacy").validate({
    rules: {
      name: {
        required:true,
      },
      owner_name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "admin/check_email_exist_validation",
          type: "post"
        }
      },
      password: {
        required: true,
        minlength: 5
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true,
        remote: {
          url: "admin/check_contact_exist_validation",
          type: "post"
        }

      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      owner_name: {
          required: "Please enter owner name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Already Exist!"
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only",
        remote: "Contact number Already Exist!"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////Add Pharmacy //////////////
///////////EDIT Pharmacy //////////////
  $("#edit_pharmacy").validate({
    rules: {
      name: {
        required:true,
      },
      owner_name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
       file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      owner_name: {
          required: "Please enter owner name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////EDIT Pharmacy //////////////


///////////// ADD POLICE ////////////



  $("#add_police").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "admin/check_email_exist_validation",
          type: "post"
        }
      },
      password: {
        required: true,
        minlength: 5
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true,
        remote: {
          url: "admin/check_contact_exist_validation",
          type: "post"
        }
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Already Exist!"
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only",
        remote :"Contact number already Exist"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////Add POLICE //////////////
///////////EDIT POLICE //////////////
  $("#edit_police").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      file:{
        extension: "JPG|JPEG|PNG",
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      file:{
         extension: "Please select following formate JPG|JPEG|PNG",
      },

      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////EDIT POLICE //////////////





//////////// Add Fire BRIGADE /////////////


  $("#add_firebrigade").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "admin/check_email_exist_validation",
          type: "post"
        }
      },
      password: {
        required: true,
        minlength: 5
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true,
        remote: {
          url: "admin/check_contact_exist_validation",
          type: "post"
        }
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Already Exist!"
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "Please enter digit only",
          remote: "Contact number Already Exist!"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////Add Fire Brigade //////////////
///////////EDIT Fire Brigade //////////////
  $("#edit_firebrigade").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true
      },
      contact_person: {
        required: true
      },
      contact: {
        required: true,
        number: true
      },
      emergency_service: {
        required: true
      },
      address:{
        required:true,
      },
       lat:{
        required:true,
      },
      pincode:{
        required:true,
        number:true
      },
      description:{
        required:true,
      },
      information:{
        required:true,
      }
    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only"
      },
      contact_person: {
        required: "Please enter contact person"
      },
      emergency_service:{
        required:"Please select emergency service"
      },
      address:{
        required:"Please enter address"
      },
       lat:{
        required:"Please select valid address",
      },
      pincode:{
        required:"Please enter pincode",
        number:"Please enter digit only"
      },
      description:{
        required:"Please enter discription"
      },
      information:{
        required:"Please enter Other Information"
      }
  }
  });

///////////EDIT Fire BRIGADE //////////////

////////////// ADD SPECIALTY TYPE //////////

  $("#add_specialty_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select specialty type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });


////////////// ADD SPECIALTY TYPE //////////
////////////// EDIT SPECIALTY TYPE //////////

  $("#edit_specialty_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select specialty type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });


////////////// EDIT SPECIALTY TYPE //////////
////////////// ADD OPD TYPE //////////

  $("#add_opd_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select opd type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });


////////////// ADD OPD TYPE //////////
////////////// EDIT OPD TYPE //////////

  $("#edit_opd_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select opd type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });


////////////// EDIT OPD TYPE //////////
////////////// ADD DEPARTMENT TYPE //////////

  $("#add_department_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select department type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });


////////////// ADD DEPARTMENT TYPE //////////
////////////// EDIT DEPARTMENT TYPE //////////

  $("#edit_department_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select department type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });


////////////// EDIT DEPARTMENT TYPE //////////

////////////// ADD FACILITY TYPE //////////

  $("#add_facility_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select facility type"
      },
      name:{
        required: "Please enter name"
      }
  }
  });

////////////// ADD FACILITY TYPE //////////

////////////// EDIT FACILITY TYPE //////////

  $("#edit_facility_type").validate({
    rules: {
      type: {
        required:true
      },
      name: {
        required: true
      }
    },
    messages: {
      type: {
          required: "Please select facility type"
      },
      name:{
        required: "Please enter name"
      }
    }
  });

////////////// EDIT FACILITY TYPE //////////

$("#add_product").validate({
        rules: 
        {
              product_name: {
                required:true,
              },
              product_image: {
                required:true,
                extension: "JPG|JPEG|PNG",
              },
              product_code: {
                required: true,
                remote: 
                {
                  url: base_url+"pharmacy_inventory/check_product_code_exist",
                  type: "post"
                }
              },
              product_manufacturer: {
                required: true,
              },
              product_type: {
                required:true,
              },
              procuct_stock: {
                required:true,
                number:true,
              },
              product_drug_info:{
                required:true,
              },

              purchase_price: {
                required:true,
                number:true,
              },
              selling_price:{
                required:true,
                number:true,
              },
              product_quantity:{
                required:true,
              },
              product_storage:{
                required:true,
              },
              product_detail:{
                required:true,
              },

              product_directions_for_use:{
                required:true,
              },
              product_key_ingreients:{
                required:true,
              },
              product_indications:{
                required:true,
              },
              product_highlights:{
                required:true,
              },
              product_directions_for_use:{
                required:true,
              },
        },
        messages: 
        {
            product_name: {
              required:"Please enter product name",
            },
             product_image: {
              required:"Please select product Image",
              extension: "Please select only JPG|JPEG|PNG",
            },
            product_code: {
              required: "Please enter product code",
              remote: "Product code already exists"
            },
            product_manufacturer: {
              required: "Please enter product manufacturer",
            },
             product_type: {
              required:"Please select product type",
            },
            product_stock: {
              required:"Please enter product stock",
              number:"Plese enter only digit",
            },
            product_drug_info:{
              required:"Please enter product drug info",
            },
            purchase_price: {
              required:"Please enter purchase price",
              number:"Please enter only digit",
            },
            selling_price:{
              required:"Please enter selling price",
              number:"Please enter only digit",
            },
            product_quantity:{
              required:"Please Enter product quantity",
            },
            product_storage:{
              required:"Please enter product storage",
            },
             product_detail:{
              required:"Please enter product storage",
            },
            product_directions_for_use:{
              required:"Please enter directions for use",
            },
             product_key_ingreients:{
              required:"Please product key ingreients ",
            },
            product_indications:{
              required:"Please enter indications",
            },
             product_highlights:{
              required:"Please enter product highlights",
            },
            product_directions_for_use:{
              required:"Please enter product directions for use",
            },
        },
});


 $("#edit_product").validate({
    rules: 
    {
      product_name: 
      {
        required:true,
      },
       product_image: 
       {
        required:true,
        extension: "JPG|JPEG|PNG",
      },
      product_code: {
        required: true,
      },
      product_manufacturer: {
        required: true,
       
      },
       product_type: {
        required:true,
      },
      procuct_stock: {
        required:true,
        number:true,
      },
      product_drug_info:{
        required:true,
      },
      purchase_price: {
        required:true,
        number:true,
      },
      selling_price:{
        required:true,
        number:true,
      },
      product_quantity:{
        required:true,
      },

       product_storage:{
        required:true,
      },
       product_detail:{
        required:true,
      },

       product_directions_for_use:{
        required:true,
      },
       product_key_ingreients:{
        required:true,
      },

       product_indications:{
        required:true,
      },
       product_highlights:{
        required:true,
      },

      product_directions_for_use:{
        required:true,
      },

      product_description:{
        required:true,
      },
    },
    messages: 
    {
      product_name: 
      {
        required:"Please enter product name",
      },
      product_image: 
      {
        required:"Please select product Image",
        extension: "Please select only JPG|JPEG|PNG",
      },
      product_code:
      {
        required: "Please enter product code",
      },
      product_manufacturer: 
      {
        required: "Please enter product manufacturer",
      },
      product_type: 
      {
        required:"Please select product type",
      },
      product_stock:
      {
        required:"Please enter product stock",
        number:"Plese enter only digit",
      },
      product_drug_info:
      {
        required:"Please enter product drug info",
      },
      purchase_price:
      {
        required:"Please enter purchase price",
        number:"Please enter only digit",
      },
      selling_price:
      {
        required:"Please enter selling price",
        number:"Please enter only digit",
      },
      product_quantity:
      {
        required:"Please Enter product quantity",
      },
      product_storage:
      {
        required:"Please enter product storage",
      },
      product_detail:
      {
        required:"Please enter product storage",
      },
      product_directions_for_use:
      {
        required:"Please enter directions for use",
      },
      product_key_ingreients:
      {
        required:"Please product key ingreients ",
      },
      product_indications:
      {
        required:"Please enter indications",
      },
      product_highlights:
      {
        required:"Please enter product highlights",
      },
      product_directions_for_use:
      {
        required:"Please enter product directions for use",
      },
      product_description:
      {
        required:"Please enter product description",
      },
  },
});





  $("#add_test_form").validate({
      rules: {
     
      test_name: {
        required: true,
         
      },
    },
    messages: {
      test_name: {
        required:"Please enter test name",
        
      },
  },
});

$("#add_lab_test_form").validate({
      rules: 
      {
        test_name: 
        {
          required: true,
        },
        test_price: 
        {
          required: true,
          number: true,
        },
      },
      messages: 
      {
        test_name: 
        {
          required:"Please enter test name",
        },
        test_price: 
        {
          required:"Please enter price ",
          number: "Please enter digit only",
        },
      },
});

$("form[name='add_consultation_report']").validate({
            rules: {
            prescription: {
              required:true,
            },
            'medicine_name[]':{
              required:true,
            },
            'medicine_type[]':{
              required:true,
            },
            'medicine_quantity[]':{
              required:true,
            },
            'molecule_name[]':{
              required:true,
            },
            'instraction[]':{
              required:true,
            },
            'best_time_medicine[]':{
              required:true,
            },
            'daily_frequency[]':{
              required:true,
            }
          },
          messages: {
            prescription: {
              required:"Please Enter prescription ",
            
            },
            'medicine_name[]':{
              required:'Please enter medicine name',
            },
            'medicine_type[]':{
              required:'Please select medicine type',
            },
            'medicine_quantity[]':{
              required:'Please select quantity ',
            },
            'molecule_name[]':{
              required:'Please enter molecule name',
            },
            'instraction[]':{
              required:'Please enter instraction ',
            },
            'best_time_medicine[]':{
              required:'Please enter best time take madicine',
            },
            'daily_frequency[]':{
              required:'Please enter daily frequency',
            }
          },
          submitHandler: function(form) 
          {
           
            var inputs = $('.field_wrapper input').length;
            var null_field = $('.field_wrapper input').filter(function(){
                    return !$(this).val();
                                }).length;

            
            if(null_field != '0')
            {
              bootbox.alert("Please fill all medicine fields other wise remove section");
            }else{
           
               $('#loader_loader').modal('show');
                var mainUrl = base_url+"doctor/consultation/add_consultation_report";            
                event.preventDefault();
                 $.ajax({
                         url: mainUrl,
                         type: 'POST',
                         data: new FormData(form),
                         mimeType: "multipart/form-data",
                         contentType: false,
                         cache: false,
                         processData: false,
                         dataType:'json',
                         success: function(response)
                         {
                             $('#loader_loader').modal('hide');
                                  bootbox.alert("prescription add successfully");
                                  url2 = base_url+ 'doctor/appointment';
                                  window.location.replace(url2);
                         }
                     });
              }
            }
});




$("form[name='add_consultation_report_hospital']").validate({
          rules: {
           prescription: {
              required:true,
            },
            'medicine_name[]':{
              required:true,
            },
            'medicine_type[]':{
              required:true,
            },
            'medicine_quantity[]':{
              required:true,
            },
            'molecule_name[]':{
              required:true,
            },
            'instraction[]':{
              required:true,
            },
            'best_time_medicine[]':{
              required:true,
            },
            'daily_frequency[]':{
              required:true,
            }
          },
          messages: {
             prescription: {
              required:"Please Enter prescription ",
            
            },
            'medicine_name[]':{
              required:'Please enter medicine name',
            },
            'medicine_type[]':{
              required:'Please select medicine type',
            },
            'medicine_quantity[]':{
              required:'Please select quantity ',
            },
            'molecule_name[]':{
              required:'Please enter molecule name',
            },
            'instraction[]':{
              required:'Please enter instraction ',
            },
            'best_time_medicine[]':{
              required:'Please enter best time take madicine',
            },
            'daily_frequency[]':{
              required:'Please enter daily frequency',
            }
          },
          submitHandler: function(form) 
          {


           
            var inputs = $('.field_wrapper input').length;
            var null_field = $('.field_wrapper input').filter(function(){
                    return !$(this).val();
                                }).length;

            
            if(null_field != '0')
            {
              bootbox.alert("Please fill all medicine fields other wise remove section");
            }else{
               $('#loader_loader').modal('show');
           

                var mainUrl = base_url+"hospitals/consultation/add_consultation_report";            
                event.preventDefault();
                 $.ajax({
                         url: mainUrl,
                         type: 'POST',
                         data: new FormData(form),
                         mimeType: "multipart/form-data",
                         contentType: false,
                         cache: false,
                         processData: false,
                         dataType:'json',
                         success: function(response)
                         {
                          $('#loader_loader').modal('hide');
                                  bootbox.alert("prescription add successfully");
                                  url2 = base_url+ 'hospitals/appointment';
                                  // alert(url2);
                                  window.location.replace(url2);

                         }
                     });
              }
            }
});
//
$("form[name='add_consultation_report_hospital_data']").validate({
          rules: {
           prescription: {
              required:true,
            },
            'medicine_name[]':{
              required:true,
            },
            'medicine_type[]':{
              required:true,
            },
            'medicine_quantity[]':{
              required:true,
            },
            'molecule_name[]':{
              required:true,
            },
            'instraction[]':{
              required:true,
            },
            'best_time_medicine[]':{
              required:true,
            },
            'daily_frequency[]':{
              required:true,
            }
          },
          messages: {
             prescription: {
              required:"Please Enter prescription ",
            
            },
            'medicine_name[]':{
              required:'Please enter medicine name',
            },
            'medicine_type[]':{
              required:'Please select medicine type',
            },
            'medicine_quantity[]':{
              required:'Please select quantity ',
            },
            'molecule_name[]':{
              required:'Please enter molecule name',
            },
            'instraction[]':{
              required:'Please enter instraction ',
            },
            'best_time_medicine[]':{
              required:'Please enter best time take madicine',
            },
            'daily_frequency[]':{
              required:'Please enter daily frequency',
            }
          },
          submitHandler: function(form) 
          {

            var inputs = $('.field_wrapper input').length;
            var null_field = $('.field_wrapper input').filter(function(){
                    return !$(this).val();
                                }).length;

            
            if(null_field != '0')
            {
              bootbox.alert("Please fill all medicine fields other wise remove section");
            }else{
               $('#loader_loader').modal('show');
           

                var mainUrl = base_url+"Admin/add_consultation_report";            
                event.preventDefault();
                 $.ajax({
                         url: mainUrl,
                         type: 'POST',
                         data: new FormData(form),
                         mimeType: "multipart/form-data",
                         contentType: false,
                         cache: false,
                         processData: false,
                         dataType:'json',
                         success: function(response)
                         {
                          $('#loader_loader').modal('hide');
                                  bootbox.alert("prescription add successfully");
                                  url2 = base_url+ 'Admin/appointment';
                                  // alert(url2);
                                  window.location.replace(url2);

                         }
                     });
              }
            }
});
//
$("#add_lab_test").validate({
      rules: 
      {
        "file[]": 
        {
          required: true,
           extension: "JPG|JPEG|PNG",
        },
      },
      messages: 
      {
       "file[]": 
        {
          required: "Please upload report" ,
          extension: "Please select following formate JPG|JPEG|PNG",
        },
      },
});

//add user
  $("#add_user").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
        remote: {
          url: "../admin/check_email_exist_validation",
          type: "post"
        }
      },
      password: {
        required: true,
        minlength: 5
      },
     
      contact: {
        required: true,
        number: true,
        remote: {
          url: "../admin/check_contact_exist_validation",
          type: "post"
        }
      },
      designation: {
        required: true
      }

    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
        remote: "Email Already Exist!"
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only",
        remote: "Contact number Already Exist!"
      },
      designation: {
        required: "Please enter contact person"
      }

  }
  });

  //edit user
  $("#edit_user").validate({
    rules: {
      name: {
        required:true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 5
      },
     
      contact: {
        required: true,
        number: true,
      },
      designation: {
        required: true
      }

    },
    messages: {
      name: {
          required: "Please enter name",
      },
      email:{
        required: "Please enter email",
        email : "Please enter valid email",
      },
      password:{
        required: "Please enter password",
        minlength: "Your password must be at least 5 characters long"
      },
      contact: {
        required: "Please enter contact number",
        number: "please enter digit only",
      
      },
      designation: {
        required: "Please enter contact person"
      }

  }
  });

 //covid form
  $("#covid_form").validate({
    rules: {
      start_date: {
        required:true
      },
      end_date: {
        required: true
      },
      start_time: {
        required: true
      },
      end_time: {
        required: true
      },
      daily_hourly_appointment: {
        required: true,
        number: true,
      },
      'day_name[]':{
        required:true,
      },
     
    },
    messages: {
      start_date: {
          required: "Please enter start date",
      },
      end_date:{
        required: "Please enter end date"
      },
      start_time:{
        required: "Please select start time"
      },
      end_time:{
        required: "Please select end time"
      },
       daily_hourly_appointment:{
        required: "Please enter daily hourly appointment",
        number: "please enter digit only",
      },
      'day_name[]':{
        required:"Please enter Week name",
      },
      
  }
  });


});



