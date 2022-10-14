export const myExtensionRootFlipCss0 = `
    import 'antd/dist/antd.css';
`;
export const myExtensionRootFlipCss1 = `
    #my-extension-root-flip {
        width: 340px;
        position: fixed;
        top: 130px;
        right: 40px;
        z-index: 9999999999;
        // z-index: 99999999;
        height: calc(100vh - 170px);
        perspective: 1800px;
    }

    .trail_fullscreen #my-extension-root-flip {
        perspective: unset;
    }

    #my-extension-root-flip.trail_flip_box {
        width: auto;
        height: auto;
    }

    .trial_create_modal_main,
    .trail_preview_modal_main {
        z-index: unset !important;  
    }

    .modal {
        background-color: transparent !important;
        overflow-y: hidden;
    }

    // .trial_create_modal_main {
    //     position: fixed !important;
    // }

    .trial_modal_show .modal {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        bottom: 0 !important;
        right: 0 !important;
        z-index: 9999999999 !important;
        display: none;
        overflow: hidden;
        outline: 0 !important;
        max-width: 500px !important;
        // min-width: 500px !important;
        transform: translate(-50%, -50%) !important;
        width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        max-height: 100% !important;
    }

    .fade.show {
        opacity: 1 !important;
        visibility: visible !important;
    }

    .trial_create_modal_main .modal {
        // height: 326px !important;
        height: 100%;
    }

    // .trial_modal_show .modal {
    //     overflow-x: hidden;
    //     overflow-y: auto;
    // }

    @media (min-width: 576px) {
        .trial_modal_show .modal-dialog {
          max-width: 500px;
          margin: 0 auto !important;
        }
      
        .trial_modal_show .modal-sm {
          max-width: 300px;
        }
    }

    .trial_modal_show .modal.show .modal-dialog {
        transition: -webkit-transform 0.3s ease-out;
        transition: transform 0.3s ease-out;
        transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
        -webkit-transform: translate(0, 0) !important;
        transform: translate(0, 0) !important;
        // position: relative;
        width: auto;
        left: 0 !important;
        padding: 0 !important;
        margin: 10px;
    }

    .trial_modal_show .modal.show .modal-dialog, 	
    .trial_modal_show .modal.show.fade .modal-dialog{	
        top: 0!important;	
    }

    .trial_modal_show .modal-content {
        position: relative !important;
        display: -ms-flexbox !important;
        display: flex !important;
        -ms-flex-direction: column !important;
        flex-direction: column !important;
        background-color: #fff !important;
        background-clip: padding-box !important;
        border: 1px solid rgba(0, 0, 0, 0.2) !important;
        border-radius: 0.3rem !important;
        outline: 0 !important;
        width: 99% !important;
        box-shadow: none !important;
        padding: 0 !important;
    }

    .trial_modal_show .modal .modal-content {
        height: auto !important;
        left: 0% !important;
        position: static !important;
        top: 0% !important;
        -webkit-transform: translateY(0%) translateX(0%) !important;
        transform: translateY(0%) translateX(0%) !important;
    }

    .trial_create_modal_main .modal .modal-content {
        border-radius: 10px !important;
        /* overflow: hidden; */
    }

    .trial_modal_show .modal-dialog .modal-content .modal-header {	
        border-radius: 10px !important;	
    }

    .trail_create_modal .modal-header, .trail_continue_modal .modal-header {
        padding: 10px 20px !important;
        background: #fff !important;
        border: none;
        box-sizing: border-box;
        text-transform: unset !important;
        text-align: left !important;
    }

    .trial_modal_show .modal-header {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: justify;
        justify-content: space-between;
        height: 44px !important;
        margin: 0 !important;
    }

    .tr_modal_trail_modal_header h5 {
        margin: 0 !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        margin-bottom: 0 !important;
        // line-height: 1.5 !important;
        color: #D53884 !important;
        line-height: 20px;
        text-transform: unset !important;
        text-align: left !important;
        letter-spacing: 0 !important;
        font-family: Montserrat;
        // font-family: "Lato", sans-serif !important;
    }

    .trial_modal_show .modal-dialog .modal-content .modal-body {	
        border: none !important;	
    }

    .trail_create_modal .modal-body {
        padding: 0 20px 15px !important;
    }

    .trial_modal_show .modal-body {
        position: relative;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        padding: 15px;
        margin: 0 !important;
    }

    .trailit_DeleteText {
        all: unset !important;
        font-weight: 500 !important;
        font-size: 18px !important;
        line-height: 29px !important;
        color: #000000 !important;
        font-family: Montserrat, "Lato", sans-serif !important;
        padding-bottom: 40px !important;
        display: block !important;
    }

    // .trail_create_modal p {
    //     margin: 0 !important;
    // }

    .trail_tooltip .trailButtonsWrapper,
    .trail_create_modal .trailButtonsWrapper {
        text-align: right;
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
        position: unset;
    }

    .tr_modal .trailButtonsWrapper {
        text-align: right;
        padding: 0;
    }

    .trail_tooltip .popover-body button,
    .trail_create_modal button {
        margin-left: 10px !important;
    }

    button:focus {
        outline: none !important;
    }

    .trailit_logoLeftBottom {
        position: fixed;
        left: 20px;
        bottom: 20px;
        width: 100px;
        z-index: 999999999 !important;
    }

    .cursor {
        cursor: pointer;
    }

    .trial_modal_show .modal-dialog-centered {
        min-height: 100%;
    }

    .modal-dialog-centered {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        min-height: calc(100% - 1rem);
    }

    .trial_modal_show .modal-dialog .modal-header .close,	
    .trial_modal_show .modal-dialog .modal-header .close:hover,	
    .trial_modal_show .modal-dialog .modal-header .close:focus,	
    .trial_modal_show .modal-dialog .modal-header .close:active {	
        transform: rotate(0)!important;	
    }	

    .trial_modal_show .close {
        float: right;
        font-size: 24px !important;
        font-weight: 400 !important;
        line-height: 24px !important;
        color: #000 !important;
        text-shadow: 0 1px 0 #fff;
        opacity: 0.5 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
        -webkit-appearance: none;
        min-height: 24px !important;
        width: 24px !important;
        position: unset !important;
    }

    .tr_icon_grp {
        display: flex;
        justify-content: space-around;
        padding-bottom: 10px;
        position: unset;
        flex-direction: unset;
    }
      
    .tr_icon_grp button img {
        margin: 0;
    }

    .trail_tooltip .popover-body .tr_icon_grp button.tr_active,
    .trail_create_modal .tr_icon_grp button.tr_active {
        filter: grayscale(0);
        background: #D41E79 !important;
    }

    .trail_create_modal .tr_icon_grp button:hover,
    .trail_create_modal .tr_icon_grp button:focus {
        background-color: #f2f2f2;
        border-color: #f2f2f2;
    }

    .trail_tooltip .popover-body .tr_icon_grp button:disabled {
        cursor: default !important;
    }

    // .trail_tooltip .popover-body .tr_icon_grp button,
    // .trail_create_modal .tr_icon_grp button {
    //     margin-right: 24px;
    // }

    .trail_create_modal .tr_icon_grp button:last-child {
        margin-right: 0;
    }

    .trail_tooltip .popover-body .tr_icon_grp button,
    .trail_create_modal .tr_icon_grp button {
        border: none;
        background: #E5E5E5;
        // width: 50px;
        min-width: 38px;
        height: 38px;
        border-radius: 50%;
        margin-left: 0 !important;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        filter: grayscale(1);
        padding: 0;
        // margin: 0 0 0 0;
    }

    .trial_modal_show .modal form {
        margin-bottom: 0;
    }

    .ant-row.ant-form-item,
    .upload_bx {
        display: table;
        width: 100%;
    }

    .trail_tooltip .ant-form-item,
    .trail_create_modal .ant-form-item {
        margin-bottom: 5px;
    }


    #my-extension-defaultroot input[type="text"]:focus,
    #my-extension-defaultroot input[type="password"]:focus,
    #my-extension-defaultroot textarea:focus,
    .trail_tooltip input[type="text"].ant-input:focus,
    .trail_tooltip input[type="password"].ant-input:focus,
    .trail_tooltip textarea.ant-input:focus,
    .trailMain input[type="text"]:focus,
    .trail_create_modal input[type="text"]:focus,
    .trailMain input[type="password"]:focus,
    // #my-extension-defaultroot *:focus,
    .trailMain textarea:focus {
        border: 1px solid #fb542b !important;
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        -moz-box-shadow: none !important;
        outline: none !important;
    }
`;

export const myExtensionRootFlipCss2 = `    
    .trail_tooltip .pl-4,
    .trail_create_modal .pl-4 {
        padding: 0 !important;
    }
    
    .popover-body .mb-2,
    .trail_create_modal .mb-2 {
        margin-bottom: 5px !important;
    }

    .trail_tooltip .upload_bx,
    .trail_create_modal .upload_bx {
        height: 83px;
        margin: 0 0 5px;
    }
    
    .trail_tooltip .ant-upload,
    .trail_create_modal .ant-upload {
        height: 83px;
        // box-sizing: border-box;
    }

    .upload_bx .ant-upload {
        height: 83px;
    }

    .upload_bx p.ant-upload-text {
        margin: 0;
        line-height: 17px;
    }

    .trail_tooltip .upload_bx p,
    .trail_create_modal .upload_bx p {
        margin: 3px 0 0;
        padding: 0;
    }
    
    .tr_select_type .upload_bx input {
        display: block;
    }

    .trail_continue_btn:hover,
    .tr_modal .ant-btn.ant-btn-primary:hover,
    #my-extension-defaultroot .ant-btn.ant-btn-primary:hover,
    .trail_tooltip .ant-btn.ant-btn-primary:hover,
    .trail_tooltip_done .ant-btn.ant-btn-primary:hover,
    #my-extension-defaultroot .optionBtn button.ant-btn:hover {
        background: #ffffff !important;
        border: 1px solid #fb542b !important;
        color: #fb542b !important;
    }

    .tr_modal .ant-btn.outlined-btn {
        color: #fb542b !important;
        border: 1px solid #fb542b !important;
        background: #fff !important;
        height: 28px;
        border-radius: 3px;

    }
    .tr_modal .ant-btn.outlined-btn:hover {
        color: #fff !important;
        background: #fb542b !important;
    }

    .trail_continue_btn,
    .tr_modal .ant-btn.ant-btn-primary,
    #my-extension-defaultroot .ant-btn.ant-btn-primary,
    .trail_tooltip .ant-btn.ant-btn-primary,
    #my-extension-defaultroot .optionBtn button.ant-btn {
        background: #fb542b !important;
        color: #ffffff;
        border: 1px solid #fb542b !important;
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        -moz-box-shadow: none !important;
        width: auto !important;
        border-radius: 3px !important;
        min-width: 82px !important;
        font-size: 12px;
        font-weight: 400 !important;
        font-family: "Lato", sans-serif !important;
        height: 28px;
        line-height: 28px;
        text-transform: uppercase;
        -webkit-text-transform: uppercase;
        margin-bottom: 0;
        letter-spacing: 0 !important;
        padding: 0 6px;
        text-align: center;
        min-height: 28px;
    }

    .trial_spinner {
        position: relative;
        width: 50px !important;
        height: 50px !important;
        display: table !important;
        margin: 10px auto !important;
        position: relative;
    }
    
    .trial_spinner img {
        width: 50px !important;
        height: 50px !important;
        background: transparent !important;
        padding: 0 !important;
    }
    
    .trial_spinner:before,
    .trial_spinner:after {
        content: "";
        display: block;
    }

    @keyframes ellipse-animation {
        0% {
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
          border-bottom-left-radius: 50%;
        }
      
        12.5% {
          border-top-left-radius: 0;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
          border-bottom-left-radius: 50%;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
        }
      
        25% {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 50%;
          border-bottom-left-radius: 50%;
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
        }
      
        37.5% {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 50%;
          -webkit-transform: rotate(135deg);
          transform: rotate(135deg);
        }
      
        50% {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }
      
        62.5% {
          border-top-left-radius: 50%;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
          -webkit-transform: rotate(225deg);
          transform: rotate(225deg);
        }
      
        75% {
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
          -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
        }
      
        87.5% {
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
          border-bottom-left-radius: 0;
          -webkit-transform: rotate(315deg);
          transform: rotate(315deg);
        }
      
        100% {
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
          border-bottom-left-radius: 50%;
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
    }

    .trial_spinner .ellipse,
    #my-extension-defaultroot .sidepopup.open .trial_spinner .ellipse {
        width: 100%;
        height: 100%;
        background-color: #fb542b;
        border-radius: 50%;
        -webkit-animation: ellipse-animation 2.4s cubic-bezier(0, -0.26, 0.32, 1.22)
            0s infinite !important;
        animation: ellipse-animation 2.4s cubic-bezier(0, -0.26, 0.32, 1.22) 0s
            infinite !important;
        -webkit-transform: rotate(0deg) !important;
        transform: rotate(0deg) !important;
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
        opacity: 1;
    }

    @-webkit-keyframes ring {
        0% {
          transform: rotate(0);
        }
      
        100% {
          transform: rotate(360deg);
        }
    }

    .ring1 {
        position: absolute;
        opacity: 1 !important;
        top: 0;
        left: 0;
        animation: ring 1s linear infinite !important;
        -webkit-animation: ring 1s linear infinite !important;
    }
    
    .ring2 {
        position: absolute;
        opacity: 1 !important;
        top: 0;
        left: 0;
        animation: ring 1s linear infinite reverse !important;
        -webkit-animation: ring 1s linear infinite reverse !important;
    }

    .ant-form-item-explain-error,
    .ant-form-item-explain-success {
        font-size: 12px;
        color: rgb(224, 4, 4);
        font-family: "Lato", sans-serif !important;
    }

    // .ant-form-item-explain.show-help,
    // .ant-form.ant-form-item-has-error,
    // .ant-form.ant-form-item-has-success,
    // .ant-form-item-explain.ant-form-item-explain-error {
    //     font-size: 12px;
    //     color: rgb(224, 4, 4);
    //     font-family: "Lato", sans-serif !important;
    // }

    // .trail_overlay {
    //     position: fixed !important;
    // }

    .trail_overlay_style {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // z-index: 99999999;
        z-index: 9999999;
        position: absolute;
    }

    .trail_tooltip.fade.show,
    .trail_tooltip_done.fade.show {
        opacity: 1 !important;
    }

    @keyframes zoom {
        0% {
          opacity: 0 !important;
        }
      
        100% {
          opacity: 1 !important;
        }
    }

    .trail_tooltip_done .popover {
        z-index: 9999999999;
        background: #ffffff !important;
        border-radius: 5px;
        padding: 0 !important;
        display: initial !important;
        box-shadow: none !important;
        border: none !important;
        animation: zoom 0.5s forwards;
        -webkit-animation: zoom 0.5s forwards;
        width: 460px !important;
        max-width: 460px !important;
        background: transparent !important;
    }

    .mobile_preview_popover .popover {
        // width: 400px !important;
        // max-width: 400px !important;

        width: calc(100% - 10px) !important;
        max-width: calc(100% - 10px) !important;
    }

    .trail_tooltip .bs-popover-auto[x-placement^="bottom"],
    .trail_tooltip_done .bs-popover-auto[x-placement^="bottom"] {
        margin: 20px 0 0 !important;
    }

    .popover.show.bs-popover-auto {
        border-radius: 5px !important;
        /* overflow: hidden; */
    }

    .trail_tooltip_done .popover * {
        animation: opacity2 0.3s forwards !important;
        -webkit-animation: opacity2 0.3s forwards !important;
        animation-delay: 0.5s !important;
        -webkit-animation-delay: 0.5s !important;
        opacity: 0;
    }

    .trail_tooltip .popover-inner,
    .trail_tooltip_done .popover-inner {
        padding: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        box-shadow: none;
    }

    .trail_tooltip_done .popover-inner {
        overflow: hidden;
        border-radius: 10px;
        background: transparent !important;
    }
     
    .trail_text_only .popover.show.bs-popover-auto .popover-inner {
        overflow: initial;
    }

    .trailit_IconRightBottom {
        position: absolute;
        bottom: -30px;
        right: 40px;
        width: 22px;
        z-index: 222;
        cursor: pointer;
    }

    @keyframes opacity2 {
        0% {
        opacity: 0;
        }
    
        100% {
        opacity: 1;
        }
    }
    
    @-webkit-keyframes opacity2 {
        0% {
        opacity: 0;
        }
    
        100% {
        opacity: 1;
        }
    }
    
    @-moz-keyframes opacity2 {
        0% {
        opacity: 0;
        }
    
        100% {
        opacity: 1;
        }
    }
`;

export const myExtensionRootFlipCss3 = `
    .trail_continue_btn {
        // position: absolute !important;
        position: fixed !important;
        right: 0;
        // bottom: -10px;
        bottom: 5%;
        box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 4px, rgba(0, 0, 0, 0.28) 0px 4px 8px !important;
        height: 30px;
        width: 120px !important;
    }

    @keyframes opacity {
        0% {
            opacity: 0;
            top: calc(100% - 93px);
            left: 50%;
            width: 0;
            height: 0;
        }

        /* 10% {
                opacity: 0.8;
                width: 0;
                height: 0;
                top: calc(100% - 93px);
                left: 50%;
        } */

        100% {
            opacity: 1;
            width: 340px;
            height: calc(100% - 80px);
            top: 0;
            left: 0;
        }
    }

    @-webkit-keyframes opacity {
        0% {
            opacity: 0;
            top: calc(100% - 93px);
            left: 50%;
            width: 0;
            height: 0;
        }

        /* 10% {
                opacity: 0.8;
                width: 0;
                height: 0;
                top: calc(100% - 93px);
                left: 50%;
        } */

        100% {
            opacity: 1;
            width: 340px;
            height: calc(100% - 80px);
            top: 0;
            left: 0;
        }
    }

    @-moz-keyframes opacity {
        0% {
            opacity: 0;
            top: calc(100% - 93px);
            left: 50%;
            width: 0;
            height: 0;
        }

        10% {
            opacity: 0.8;
            width: 0;
            height: 0;
            top: calc(100% - 93px);
            left: 50%;
        }

        100% {
            opacity: 1;
            width: 340px;
            height: calc(100% - 80px);
            top: 0;
            left: 0;
        }
    }

    .trail_preview_bx,
    .trail_modal_content_main {
        max-width: calc(100% - 80px) !important;
        margin: 0 auto !important;
        border-radius: 10px !important;
        position: relative !important;
        overflow: hidden !important;
    }

    .trail_text_only .trail_preview_bx,
    .trail_modal_content_main {
        background: #ffffff !important;
        box-shadow: 0 0 9px rgba(0, 0, 0, 0.5) !important;
    }

    .trail_tooltip_done .popover-header {
        user-select: none;
        background: none !important;
        border-bottom: none !important;
        padding: 12px 15px 0 !important;
        font-size: 18px !important;
        line-height: 20px !important;
        font-weight: 700 !important;
        font-family: "Lato", sans-serif !important;
        margin: 0px !important;
        color: #333333 !important;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
    }

    .tooltip_title_mobile {
        width: 75% !important;
    }

    .trail_tooltip_done .popover-body,
    .trail_tooltip_done .popover-body a {
        display: flex !important;
        flex-direction: column !important;
        padding: 8px 15px 10px !important;
        font-family: "Lato", sans-serif !important;
        font-size: 14px !important;
        line-height: 20px !important;
        color: #333333 !important;
    }

    .trail_tooltip_done .popover-body p {
        width: auto;
        font-size: 16px !important;
        line-height: 20px !important;
        display: inline-block !important;
        font-family: "Lato", sans-serif !important;
    }

    .trail_tooltip_done .popover-body {
        user-select: none;
    }

    .trail_tooltip_done.tr_audio_only [x-placement="top"] .bottom.popover-header,
    .trail_tooltip_done.tr_audio_only [x-placement="bottom"] .top.popover-header,
    .trail_tooltip_done.tr_picture_only [x-placement="top"] .bottom.popover-header,
    .trail_tooltip_done.tr_picture_only [x-placement="bottom"] .top.popover-header,
    .trail_tooltip_done .bottom.popover-header {
        display: none;
    }

    .trail_tooltip_done .btn-wrap {
        margin: 0 !important;
        display: flex !important;
        // margin: 15px 0 10px !important;
        justify-content: flex-end !important;
    }

    button.ant-btn.trial_button_close.ant-btn-link {
        background: rgba(255, 255, 255, 0.6) !important;
        padding: 0 !important;
        border: none !important;
        border-radius: 50% !important;
        position: absolute !important;
        top: -10px !important;
        right: 25px !important;
        overflow: hidden !important;
        height: 20px !important;
        width: 20px !important;
        min-height: 20px !important;
        font-size: 13px !important;
        padding: 0 !important;
        color: #000 !important;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3) !important;
        z-index: 999999;
    }
    
    button.ant-btn.trial_button_close.ant-btn-link span {
        color: #000;
        display: flex;
        align-items: center;
        width: 20px !important;
        justify-content: center;
        height: 20px !important;
        background: rgba(255, 255, 255, 0.6) !important;
    }

    button.ant-btn.trial_button_close.ant-btn-link svg {
        width: 13px !important;
        height: 13px !important;
    }

    .trail_tooltip_done button.ant-btn.ant-btn-link.next,
    .trail_tooltip_done button.ant-btn.ant-btn-link.prev,
    .trail_preview_modal button.ant-btn.ant-btn-link.next,
    .trail_preview_modal button.ant-btn.ant-btn-link.prev {
        top: calc(50% - 14px);
        position: absolute;
        margin: 0 !important;
        width: 30px !important;
        padding: 0 !important;
        border-radius: 50% !important;
        overflow: hidden;
        border: none !important;
        min-height: 28px;
        height: 28px;
    }

    .trail_tooltip_done button.ant-btn.ant-btn-link.next,
    .trail_preview_modal button.ant-btn.ant-btn-link.next {
        right: 0;
        display: block;
    }

    .trail_tooltip_done button.next span,
    .trail_tooltip_done button.prev span,
    .trail_preview_modal button.next span,
    .trail_preview_modal button.prev span {
        color: #ffff;
        align-items: center;
        display: flex;
        justify-content: center;
        height: 28px;
        width: 30px;
        background: linear-gradient(
            324deg,
            rgba(230, 16, 0, 1) 0%,
            rgba(255, 136, 78, 1) 100%
        ) !important;
    }
    
    .trail_preview_modal button.next span svg,
    .trail_preview_modal button.prev span svg,
    .trail_tooltip_done button.next span svg,
    .trail_tooltip_done button.prev span svg {
        fill: #ffff !important;
    }
    
    .trail_tooltip .bs-popover-auto[x-placement^=top]>.arrow::after,
    .trail_tooltip .bs-popover-top>.arrow::after {
        content: "";
        bottom: 1px;
        border-width: .5rem .5rem 0;
        border-top-color: #ffffff;
    }
    
    .trail_tooltip .popover .arrow::after,
    .trail_tooltip .popover .arrow::before {
        position: absolute;
        display: block;
        content: "";
        border-color: transparent;
        border-style: solid;
    }
    
    .popover .arrow {
        position: absolute;
        display: block;
        width: 1rem;
        height: 0.5rem;
        margin: 0 0.3rem;
        border: none !important;
    }

    .trail_tooltip .popover .arrow {
        position: absolute;
        display: block;
        width: 1rem;
        height: 0.5rem;
        margin: 0 0.3rem;
    }
    
    .popover .arrow::before,
    .popover .arrow::after {
        position: absolute;
        display: block;
        content: "";
        border-color: transparent;
        border-style: solid;
    }
    
    .bs-popover-top,
    .bs-popover-auto[x-placement^="top"] {
        margin-bottom: 0.5rem;
    }
    
    .bs-popover-top>.arrow,
    .bs-popover-auto[x-placement^="top"]>.arrow {
        bottom: calc(-0.5rem - 1px);
    }
    
    .bs-popover-top>.arrow::before,
    .bs-popover-auto[x-placement^="top"]>.arrow::before {
        bottom: 0;
        border-width: 0.5rem 0.5rem 0;
        border-top-color: rgba(0, 0, 0, 0.25);
    }
    
    .bs-popover-top>.arrow::after,
    .bs-popover-auto[x-placement^="top"]>.arrow::after {
        bottom: 1px;
        border-width: 0.5rem 0.5rem 0;
        border-top-color: #fff;
    }
    
    .bs-popover-right,
    .bs-popover-auto[x-placement^="right"] {
        margin-left: 0.5rem;
    }
    
    .bs-popover-right>.arrow,
    .bs-popover-auto[x-placement^="right"]>.arrow {
        left: calc(-0.5rem - 1px);
        width: 0.5rem;
        height: 1rem;
        margin: 0.3rem 0;
    }
    
    .bs-popover-right>.arrow::before,
    .bs-popover-auto[x-placement^="right"]>.arrow::before {
        left: 0;
        border-width: 0.5rem 0.5rem 0.5rem 0;
        border-right-color: rgba(0, 0, 0, 0.25);
    }
    
    .bs-popover-right>.arrow::after,
    .bs-popover-auto[x-placement^="right"]>.arrow::after {
        left: 1px;
        border-width: 0.5rem 0.5rem 0.5rem 0;
        border-right-color: #fff;
    }
    
    .bs-popover-bottom,
    .bs-popover-auto[x-placement^="bottom"] {
        margin-top: 0.5rem;
    }
    
    .bs-popover-bottom>.arrow,
    .bs-popover-auto[x-placement^="bottom"]>.arrow {
        top: calc(-0.5rem - 1px);
    }
    
    .bs-popover-bottom>.arrow::before,
    .bs-popover-auto[x-placement^="bottom"]>.arrow::before {
        top: 0;
        border-width: 0 0.5rem 0.5rem 0.5rem;
        border-bottom-color: rgba(0, 0, 0, 0.25);
    }
    
    .bs-popover-bottom>.arrow::after,
    .bs-popover-auto[x-placement^="bottom"]>.arrow::after {
        top: 1px;
        border-width: 0 0.5rem 0.5rem 0.5rem;
        border-bottom-color: #fff;
    }
    
    .bs-popover-bottom .popover-header::before,
    .bs-popover-auto[x-placement^="bottom"] .popover-header::before {
        position: absolute;
        top: 0;
        left: 50%;
        display: block;
        width: 1rem;
        margin-left: -0.5rem;
        content: "";
        // border-bottom: 1px solid #f7f7f7;
    }
    
    .bs-popover-left,
    .bs-popover-auto[x-placement^="left"] {
        margin-right: 0.5rem;
    }
    
    .bs-popover-left>.arrow,
    .bs-popover-auto[x-placement^="left"]>.arrow {
        right: calc(-0.5rem - 1px);
        width: 0.5rem;
        height: 1rem;
        margin: 0.3rem 0;
    }
    
    .bs-popover-left>.arrow::before,
    .bs-popover-auto[x-placement^="left"]>.arrow::before {
        right: 0;
        border-width: 0.5rem 0 0.5rem 0.5rem;
        border-left-color: rgba(0, 0, 0, 0.25);
    }
    
    .bs-popover-left>.arrow::after,
    .bs-popover-auto[x-placement^="left"]>.arrow::after {
        right: 1px;
        border-width: 0.5rem 0 0.5rem 0.5rem;
        border-left-color: #fff;
    }
        
`;

export const myExtensionRootFlipCss4 = `
    .trail_preview_modal .modal-content {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
    }

    .trail_modal_content_main {
        box-sizing: border-box;
        padding: 12px 15px 10px !important;
    }

    .trail_preview_modal .trail_modal_title {
        background: none !important;
        border-bottom: none !important;
        padding: 12px 15px 0 !important;
        font-size: 18px !important;
        line-height: 20px !important;
        font-weight: 700 !important;
        font-family: "Lato", sans-serif !important;
        margin: 0px !important;
        color: #333333 !important;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        user-select: none;
    }
    .trail_modal_title.p-0{
        padding: 0px !important;
    }

    .trail_preview_modal .trail_modal_content {
        // display: flex !important;
        // flex-direction: column !important;
        padding: 8px 15px 10px !important;
    }

    .trail_preview_modal .trail_modal_content,
    .trail_preview_modal .trail_modal_content p,
    .trail_preview_modal .trail_modal_content a {
        font-family: "Lato", sans-serif !important;
        font-size: 14px !important;
        line-height: 20px !important;
        color: #333333 !important;
    }

    .trail_tooltip_done button.ant-btn.ant-btn-link.prev,
    .trail_preview_modal button.ant-btn.ant-btn-link.prev {
        left: 0;
        display: block;
    }

    .trail_tooltip_done button.ant-btn.ant-btn-link.next,
    .trail_preview_modal button.ant-btn.ant-btn-link.next {
        right: 0;
        display: block;
    }

    .tr_preview_video_bx {
        height: 214px;
        background-color: #000000;
    }

    .preview-audio {
        width: 100%;
        margin-bottom: 10px;
    }
    
    .preview-video {
        width: 100%;
        height: auto;
        margin-bottom: 10px;
        position: relative;
    }
    
    .preview-picture {
        // width: 100%;
        width: auto;
        height: 100%;
        margin-bottom: 10px;
    }
    
    .preview-title {
        text-align: center;
        margin: 10px 0;
        color: #333333;
        font-size: 14px;
        font-family: "Lato", sans-serif !important;
    }

    .trail_tooltip_done.tr_video_only .trail_modal_content_main,
    .trail_tooltip_done.tr_picture_only .popover-body,
    .trail_tooltip_done.tr_picture_only .trail_modal_content_main,
    .trail_tooltip_done.tr_audio_only .trail_modal_content_main {
        padding: 0 !important;
    }

    .trail_tooltip_done.tr_video_only .popover-header,
    .trail_preview_modal.trail_tooltip_done.tr_video_only .trail_modal_title {
        padding: 0 !important;
        position: absolute;
        top: 15px;
        left: 15px;
        max-width: 300px;
        z-index: 99;
        color: #ffffff !important;
        width: auto;
        text-align: left;
    }

    .trail_preview_modal.tr_video_only .trail_modal_content,
    .trail_preview_modal.tr_audio_only .trail_modal_content,
    .trail_preview_modal.tr_picture_only .trail_modal_content {
        display: none !important;
    }

    * {
        text-shadow: none !important;
        -webkit-text-shadow: none !important;
        -moz-text-shadow: none !important;
    }

    .tr_video_only video {
        // object-fit: initial;
        height: 100%;
    }

    .trail_tooltip_done.tr_video_only video.preview-video {
        margin: 0;
        display: block;
    }

    // video::-webkit-media-controls-volume-slider {
    //     display: none !important;
    // }
    video::-webkit-media-controls-fullscreen-button {
        display: none !important;
    }

    .trail_preview_modal .modal-body,
    .tr_modal .tr_notification_bx {
        padding: 0 !important;
    }

    .tr_audio_only h3.popover-header,
    .trail_preview_modal.tr_audio_only .trail_modal_title,
    .trail_preview_modal.tr_picture_only .trail_modal_title,
    .tr_picture_only h3.popover-header {
        color: #fff !important;
        padding: 12px 15px 12px !important;
    }

    .tr_audio_only .popover-body,
    .tr_picture_only .popover-body {
        padding: 0 !important;
    }

    .trail_tooltip_done.tr_audio_only .popover.show.bs-popover-auto,
    .trail_tooltip_done.tr_picture_only .popover.show.bs-popover-auto {
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        border: none !important;
    }

    .trail_tooltip_done.tr_audio_only .popover-inner,
    .trail_tooltip_done.tr_picture_only .popover-inner {
        background: none !important;
    }

    .trail_tooltip_done.tr_audio_only [x-placement="top"]
    button.ant-btn.ant-btn-link.next,
    .trail_tooltip_done.tr_audio_only [x-placement="top"]
    button.ant-btn.ant-btn-link.prev {
        top: auto;
        bottom: 26px;
    }

    .trail_tooltip_done.tr_audio_only [x-placement="bottom"]
    button.ant-btn.ant-btn-link.next,
    .trail_tooltip_done.tr_audio_only [x-placement="bottom"]
    button.ant-btn.ant-btn-link.prev {
        top: 26px;
        bottom: auto;
    }

    .trail_tooltip_done.tr_audio_only [x-placement="top"] .top.popover-header,
    .trail_tooltip_done.tr_audio_only [x-placement="bottom"] .bottom.popover-header,
    .trail_tooltip_done.tr_picture_only [x-placement="top"] .top.popover-header,
    .trail_tooltip_done.tr_picture_only
    [x-placement="bottom"]
    .bottom.popover-header {
        display: block;
    }

    .trail_preview_modal.tr_audio_only .trail_modal_title,
    .tr_audio_only h3.popover-header,
    .trail_preview_modal.tr_picture_only .trail_modal_title,
    .tr_picture_only h3.popover-header {
        background: #1c1e20 !important;
        display: table;
        width: auto;
        margin: 0 auto !important;
        width: 300px;
        opacity: 1 !important;
        color: #ffffff !important;
    }

    .tr_audio_only h3.top.popover-header,
    .tr_audio_only .trail_modal_title,
    .tr_picture_only .trail_modal_title,
    .tr_picture_only h3.top.popover-header {
        border-radius: 10px 10px 0 0;
    }

    .tr_audio_only .trail_modal_content_main,
    .tr_picture_only .trail_modal_content_main {
        background: none !important;
        box-shadow: none !important;
    }

    .tr_audio_only h3.bottom.popover-header,
    .tr_picture_only h3.bottom.popover-header {
        border-radius: 0 0 10px 10px;
    }

    .trail_tooltip_done.tr_audio_only [x-placement="top"]
    button.ant-btn.trial_button_close.ant-btn-link,
    .trail_preview_modal.trail_tooltip_done.tr_audio_only
    .ant-btn.trial_button_close.ant-btn-link {
        right: 70px !important;
    }

    .trail_tooltip_done.tr_audio_only [x-placement="bottom"]
    button.ant-btn.trial_button_close.ant-btn-link {
        right: 40px !important;
    }

    .trail_preview_modal.tr_audio_only .trail_modal_title {
        width: 340px;
    }

    .trail_modal_title_mobile {
        // width: 250px !important;
        width: 75% !important;
    }

    .trail_tooltip .bs-popover-auto[x-placement^="top"],
    .trail_tooltip_done .bs-popover-auto[x-placement^="top"] {
      margin: 0 0 20px !important;
    }
    
    .trail_tooltip_done .popover-body div {
        font-size: 14px;
        font-weight: normal;
        color: #000 !important;
    }

    .trail_tooltip_done .audio_wrap_tooltip {
        position: static !important;
    }

    // .trail_tooltip_done .audio_wrap_tooltip_innr {
    //     background: linear-gradient(
    //         60deg,
    //         #f79533,
    //         #f37055,
    //         #ef4e7b,
    //         #a166ab,
    //         #5073b8,
    //         #1098ad,
    //         #07b39b,
    //         #6fba82
    //     );
    //     -webkit-animation: animatedgradient 3s ease alternate infinite !important;
    //     animation: animatedgradient 3s ease alternate infinite !important;
    //     background-size: 300% 300%;
    //     opacity: 1;
    // }

    .tr_gradient_border {
        --borderWidth: 5px;
        background: #1d1f20;
        position: relative;
    }

    .ex_mr_10 {
        margin-right: 10px;
    }

    .trail_container .sidepanal .audio_wrap_tooltip{
        bottom: auto;
        top: 60vh;
        right: 80px;
    }
`;

export const myExtensionRootFlipCss5 = `
    @-webkit-keyframes animatedgradient {
        0% {
            background-position: 0% 50%;
        }
    
        50% {
            background-position: 100% 50%;
        }
    
        100% {
            background-position: 0% 50%;
        }
    }
    
    @keyframes animatedgradient {
        0% {
            background-position: 0% 50%;
        }
    
        50% {
            background-position: 100% 50%;
        }
    
        100% {
            background-position: 0% 50%;
        }
    }

    .trail_tooltip_done .popover-body div[class*="tr_audioplayer-"],
    .trail_tooltip_done .popover-body div.volume {
        color: #ffffff !important;
        font-family: "Lato", sans-serif !important;
    }

    .tr_preview_picture_bx {
        display: flex;
        height: 214px;
        justify-content: center;
        background-color: #000000;
    }

    .trail_tooltip_done.tr_picture_only img.preview-picture {
        margin: 0 !important;
        height: 100%;
        // width: 100%;
        width: auto;
    }

    .tr_picture_only .trail_modal_title,
    .tr_picture_only h3.popover-header {
        width: 380px !important;
        padding: 10px !important;
    }

    .trail_preview_modal.tr_picture_only .trail_modal_title {
        width: 420px !important;
    }

    .modal-backdrop.show.fade {
        opacity: 0.5 !important;
        filter: alpha(opacity=1) !important;
        display: block !important;
        z-index: 99999 !important;
    }

    .trial_modal_show .modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        // background-color: #000;
        background-color: rgba(0,0,0,0.8);
    }

    .tr_gradient_border:after {
        content: "";
        position: absolute;
        top: calc(-1 * var(--borderWidth));
        left: calc(-1 * var(--borderWidth));
        height: calc(100% + var(--borderWidth) * 2);
        width: calc(100% + var(--borderWidth) * 2);        
        background: linear-gradient(
            60deg,
            #f79533,
            #f37055,
            #ef4e7b,
            #a166ab,
            #5073b8,
            #1098ad,
            #07b39b,
            #6fba82
        );
        z-index: -1;
        -webkit-animation: animatedgradient 3s ease alternate infinite;
        animation: animatedgradient 3s ease alternate infinite;
        background-size: 300% 300%;
    } 

    .trail_preview_bx .tr_gradient_border:after {
        content: none;
    }

    .trail_tooltip_done.tr_video_only .popover-body {
        padding: 0 !important;
    }

    .trail_tooltip_done .popover-body a:visited {
        color: #4d8cff !important;
    }

    .trail_tooltip_done .popover-body a:hover {
        color:  #333333 !important;
    }

    .trail_tooltip_done .popover-body a {
        display: inline-block !important;
        width: auto;
        font-family: "Lato", sans-serif !important;
        font-size: 16px !important;
        line-height: 20px !important;
        color: #4d8cff !important;
        padding: 0px !important;
        text-decoration: none;
    }

    .ant-btn[disabled] {
        cursor: not-allowed !important;
    }
    .ant-btn[disabled] > * {
        pointer-events: none !important;
    }

    .ant-btn[disabled],
    .ant-btn[disabled]:hover,
    .ant-btn[disabled]:focus,
    .ant-btn[disabled]:active {
        color: rgba(0, 0, 0, 0.25);
        background: #f5f5f5;
        border-color: #d9d9d9;
        text-shadow: none !important;
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
    }

    .continue-modal-text {
        // position: absolute;
        // width: 189px;
        height: 22px;
        font-family: Montserrat, "Lato", sans-serif !important;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 22px;
        /* identical to box height */
        // display: flex;
        // align-items: flex-end;
        color: #D53884;
        text-transform: capitalize;
        text-align: center;
        margin-top: -12px !important;
        margin-bottom: 2rem !important;
    }

    .tr_modal_trail_modal_header.confirmation_modal {
        padding-top: 10px !important;
        padding-right: 20px !important;
        height: auto !important;
    }

    .modal-and-bubble-option-container {
        display: flex;
        justify-content: space-around;
        vertical-align: middle;
        // height: 7.5rem;
    }

    .video-bubble-option,
    .video-modal-option,
    .audio-bubble-option,
    .audio-modal-option {
        display: flex;
        cursor: pointer;
        position: relative;
        text-align: center;
        flex-direction: column;
    }

    .video-modal-container,
    .audio-modal-container {
        margin-top: 10px;
    }

    .bubble_user_svg,
    .bubble_mic_svg {
        position: absolute;
        
    }

    .bubble_user_svg {
        top: 19px;
        left: 23.5px;
        // height: 54px;
        // width: 43.2px;
    }

    .bubble_mic_svg {
        left: 31px;
        top: 27px;
        // width: 39px;
        // height: 39px;
    }

    .modal-video-svg,
    .modal-audio-svg {      
        // width: 39px;
        // height: 39px;
        left: 34px;
        top: 29.5px;
        position: absolute;
    }

    // .modal-audio-svg {
    //     left: 34px;
    // }

    // .modal-video-svg {        
    //     left: 34px;
    // }

    .confirmation-modal-span {
        color: #D02176;
        font-size: 12px;
        font-weight: 500;
        line-height: 15px;
        font-style: normal;
        font-family: Montserrat, 'LATO';
        text-transform: capitalize;
        margin-top: 3px;
    }    

    .custom-css {
        margin-top: 10px;
    }

    .custom-button-unlink {
        margin-left: 5px !important;
        width: 60px;
    }

    .custom-button-link {
        margin-left: 0 !important;
        width: 55px;
    }

    .custom-button {
        width: 72.27px;
        height: 25px;
        background-color: #D41E79;
        border-radius: 15px;
        border: none;
        border: 1px solid #D41E79 !important;
        color: #ffffff;
        font-family: 'Montserrat';
        text-transform: uppercase;
        font-size: 10px;
        line-height: 12.19px;
        padding: 1px 6px !important;
    }

    .custom-button:hover {
        color: #D41E79;
        background-color: #ffffff;
    }

    .custom-button[disabled],
    .custom-button[disabled]:hover {   
        color: #ffffff;     
        background: #808080;
        cursor: not-allowed !important;
        border: 1px solid #808080 !important;
    }

    .mt-13 {
        margin-top: 13px;
    }

    .mt-8 {
        margin-top: 8px;
    }

    .mt-40 {
        margin-top: 40px
    }

    .mt-10 {
        margin-top: 10px
    }

    .mr-5 {
        margin-right: 5px
    }

    .pb-0 {
        padding-bottom: 0px !important;
    }

    .share-button,
    .add-step-button {
        width: 108px !important;
        height: 36px !important;
        font-size: 13px;
        border-radius: 50px !important;
    }

    .trailit_right_container button:focus {
        border: none !important;
    }

    .scrollable-steps-list {
        // max-height: 600px;
        // max-height: 80%;
        // overflow: auto;
    }

    .scrollable-steps-list::-webkit-scrollbar-track,
    .sidepopcontent::-webkit-scrollbar-track {
        -webkit-box-shadow: none;
        background-color: transparent;
    }

    .scrollable-steps-list::-webkit-scrollbar,
    .sidepopcontent::-webkit-scrollbar {
        width: 7px;
        background-color: transparent;
    }

    .scrollable-steps-list::-webkit-scrollbar-thumb,
    .sidepopcontent::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: none;
        background-color: #c4c4c4;
    }

    .tr_side_form::-webkit-scrollbar-track {
        display: none;
    }

    .tr_side_form::-webkit-scrollbar {
        display: none;
    }

    .tr_side_form::-webkit-scrollbar-thumb {
        display: none;
    }

    .add-step-bt-container {
        margin-top: 10px;
        text-align: center;
    }

    .trail_flipped .my-extension.my-extension-mobile {
        display: none;
    }

    .overflow1 {
        overflow: auto;
    }

    @keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
    }

    #extension-splash-screen {
        top: 0;
        width: 100%;
        height: 100%;
        display: none;
        position: fixed;
        align-items: center;
        z-index: 999999999999;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(255, 255, 255, 0.5);
    }

    #extension-splash-screen svg {
        animation: rotate 2s linear infinite;
        margin-left: calc(100vw - 100%);
        width: 60px;
        height: 60px;
    }
    
    #extension-splash-screen svg circle {
        stroke: #D41E79;
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
    }

    .widthAuto {
        width: auto !important;
    }

    .mt-18 {
        margin-top: 18px;
    }

    .pr5px {
        padding-right: 5px !important;
    }
`;

// export const myExtensionRootCss = `
//     #my-extension-root {
//         font-family: 'Lato', sans-serif!important;
//         width: 40px;
//         height: 430px;
//         float: right;
//     }

//     #my-extension-root button:focus {
//         outline: none;
//     }

//     #my-extension-root .wrap .blob {
//         cursor: pointer;
//         border: none;
//         outline: none;
//         position: relative;
//         z-index: 10;
//         background: transparent!important;
//         right: 0;
//         width: 100%;
//         height: 40px;
//     }

//     #my-extension-root .wrap.open .blob {
//         display: block;
//         box-shadow: none;
//         -webkit-box-shadow: none;
//         -moz-box-shadow: none;
//         padding: 0;
//     }
//     #my-extension-root .wrap .blob {
//         margin-top: 10px;
//         display: block;
//     }

//     #my-extension-root .my-extension,
//     #my-extension-root .wrap {
//         width: 100%;
//         height: 100%;
//         position: relative;
//         text-align: right;
//     }

//     #my-extension-root .wrap .blob svg {
//         box-shadow:0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -webkit-box-shadow:0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -moz-box-shadow:0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         background: #fff;
//         -webkit-border-radius: 50%;
//         -moz-border-radius: 50%;
//         border-radius: 50%;
//         float: right;
//         width: 40px !important;
//         height: 40px !important;
//     }

//     #my-extension-root .wrap .blob:after {
//         content: attr(data-title);
//         color: #fb542b;
//         width: 130px;
//         margin-right: 6px;
//         box-shadow:0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -webkit-box-shadow:0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -moz-box-shadow:0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         background: #fff;
//         font-family: 'Lato', sans-serif;
//         font-size: 14px;
//         line-height: 30px;
//         font-weight: 400!important;
//         text-align: center;
//         -webkit-border-radius: 5px;
//         -moz-border-radius: 5px;
//         border-radius: 5px;
//         position: absolute;
//         top: 6px;
//         right: 50px;
//         text-transform: capitalize!important;
//         letter-spacing: 0;
//     }

//     #my-extension-root .wrap .blob:hover::after {
//         color: #ffffff;
//         background:#fb542b;
//     }

//     #my-extension-root button.menu , #my-extension-defaultroot button.menu{
//         position: relative;
//         height: 40px;
//         min-height: 40px;
//         width: 40px;
//         display: block;
//         margin-top: 10px;
//         background: linear-gradient(
//             324deg,
//             rgba(230, 16, 0, 1) 0%,
//             rgba(255, 136, 78, 1) 100%
//         );
//         box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -webkit-box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -moz-box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
//         -webkit-border-radius: 50%;
//         -moz-border-radius: 50%;
//         border-radius: 50%;
//         border: none;
//         cursor: pointer;
//         padding: 0;
//     }

//     #my-extension-root .menu img, #my-extension-defaultroot button.menu img {
//         /* margin-top: 4px; */
//         width: 30px;
//         margin: 0;
//         height: 30px;
//         vertical-align: middle;
//         background: transparent!important;
//         display: initial;
//     }

//     #my-extension-root .wrap .blob:hover .svg_btn2 {
//         fill: #ffffff;
//         stroke: #ffffff;
//     }

//     #my-extension-root .wrap .blob:hover .svg_btn {
//         fill: #ffffff !important;
//         stroke: #fb542b;
//     }

//     #my-extension-root .wrap .blob:hover #Ellipse_101 {
//         fill: #fb542b;
//     }

//     #my-extension-root .wrap .blob:hover span {
//         background: #fb542b;
//         color: #ffffff;
//     }

//     #my-extension-root .menu img.trail_plus {
//         width: 24px;
//         height: 24px;
//         top: 8px;
//         right: 7px;
//     }

//     .wrap button.blob{
//         -webkit-transform: scale(0);
//         transform:  scale(0);
//         transition: all .5s;
//     }

//     .wrap.open button.blob{
//         -webkit-transform: scale(1);
//         transform:  scale(1);
//     }

//     .wrap button:nth-child(1) {
//         transition-delay: 50ms;
//     }

//     .wrap.open button:nth-child(1) {
//         transition-delay: 150ms;
//     }
//     .wrap button:nth-child(2) {
//         transition-delay: 100ms;
//     }

//     .wrap.open button:nth-child(2) {
//         transition-delay: 100ms;
//     }

//     .wrap button:nth-child(3) {
//         transition-delay: 150ms;
//     }
//     .wrap.open button:nth-child(3) {
//         transition-delay: 50ms;
//     }

//     .wrap button:nth-child(5) {
//         transition-delay: 200ms;
//     }

//     .wrap.open button:nth-child(5) {
//         transition-delay: 50ms;
//     }

//     .wrap button:nth-child(6) {
//         transition-delay: 150ms;
//     }

//     .wrap.open button:nth-child(6) {
//         transition-delay: 100ms;
//     }

//     .wrap button:nth-child(7) {
//         transition-delay: 100ms;
//     }

//     .wrap.open button:nth-child(7) {
//         transition-delay: 150ms;
//     }

//     .wrap button:nth-child(8) {
//         transition-delay: 50ms;
//     }

//     .wrap.open button:nth-child(8) {
//         transition-delay: 200ms;
//     }

//     .wrap .trail_plus {
//         opacity: 0;
//         position: absolute;
//         top: 0;
//         right: 0;
//     }

//     .wrap .trail_edit {
//         width: 20px!important;
//         height: 20px!important;
//         position: absolute;
//         top: 10px;
//         right: 10px;
//     }

//     .wrap.open .trail_plus {
//         opacity: 1;
//     }

//     .wrap.open .trail_edit {
//         opacity: 0;
//     }

//     .wrap .menu img {
//         -webkit-transform: rotate(0);
//         transform: rotate(0);
//         -webkit-transition: -webkit-transform 150ms cubic-bezier(.4,0,1,1);
//         transition: transform 150ms cubic-bezier(.4,0,1,1);
//     }

//     .wrap.open .menu img {
//         -webkit-transform:  rotate(315deg);
//         transform: rotate(315deg);
//         -webkit-transition: -webkit-transform 150ms cubic-bezier(.4,0,1,1);
//         transition: transform 150ms cubic-bezier(.4,0,1,1);
//     }
// `;
