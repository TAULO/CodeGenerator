const fs = require( 'fs' );
const path = require( 'path' );
const helper = require( './helper' );

const ToC_constString = 'Inhaltsverzeichnis';
const AbbreviationsPage_constString = 'Abkürzungsverzeichnis';

const GetFirstPage = () => {
    const pathFile = path.join( __dirname , 'Files' , 'page1.html' );
    const pagedata = fs.readFileSync( pathFile , 'utf-8' );
    //pagedata = pagedata.replace( /\{\{opinionNo\}\}/g , opinion.opinionNo );
    return pagedata;
}

const GetParticipant = ( element ) => {
    if ( !element )
        return '';
    let participant = '';
    if ( !helper.EmptyString( element.gender ) )
        participant += element.gender;
    if ( !helper.EmptyString( element.academicTitle ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' ';
        participant += element.academicTitle;
    }
    if ( !helper.EmptyString( element.firstName ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' ';
        participant += element.firstName;
    }
    if ( !helper.EmptyString( element.lastName ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' ';
        participant += element.lastName;
    }
    if ( !helper.EmptyString( element.position ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' / ';
        participant += element.position;
    }
    if ( !helper.EmptyString( element.comment ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' / ';
        participant += element.comment;
    }
    
    if ( !helper.EmptyString( participant ) )
        participant = `<li>${participant}</li>`;
    return participant;
}

const GetExpert = ( expert , long = true ) => {
    // long = Erweiterte "Version" mit advancedQualification (nur) für Seite 2.
    if ( !expert )
        return '';
    let exp = '';
    if ( !helper.EmptyString( expert.title ) )
        exp += expert.title;
    if ( !helper.EmptyString( expert.firstName ) ) {
        if ( !helper.EmptyString( exp ) )
            exp += ' ';
        exp += expert.firstName;
    }
    if ( !helper.EmptyString( expert.lastName ) ) {
        if ( !helper.EmptyString( exp ) )
            exp += ' ';
        exp += expert.lastName;
    }
    if ( long ) {
        if ( !helper.EmptyString( exp )
          && !helper.EmptyString( expert.advancedQualification ) )
            exp += '<br>';
        if ( !helper.EmptyString( expert.advancedQualification ) )
            exp += `${expert.advancedQualification}`;
        
        if ( !helper.EmptyString( exp )
          && !helper.EmptyString( expert.company ) )
            exp += '<br>';
        if ( !helper.EmptyString( expert.company ) )
            exp += `${expert.company}`;
    }       
    return exp;
}

const GetSecondPage = ( opinion ) => {
    const pathFile = path.join( __dirname , 'Files' , 'page2.html' );
    let pagedata = fs.readFileSync( pathFile , 'utf-8' );
    //let pagedata = fs.readFileSync( './Files/page2.html' , 'utf-8' );
    //pagedata = pagedata.replace( /\{\{company_name\}\}/ , opinion.customer.name );
    ///**/pagedata = pagedata.replace( /\{\{AuftraggeberName\}\}/ , '' );//'opinion.customer.contact_person' );
    pagedata = pagedata
    .replace( /\{\{street\}\}/ , opinion.customer.street )
    .replace( /\{\{postal_city\}\}/ , (opinion.customer.postalCode + ' ' + opinion.customer.city) );

    // Datumsangaben.
    const useMomentFormat = true;// Wird hier fest gesetzt.
    if ( useMomentFormat ) {
        const moment = require( 'moment' );
        pagedata = pagedata.replace( /\{\{PRJ_Datum_Start\}\}/ , moment( opinion.dateFrom ).format( 'DD.MM.YYYY' ) );
        // Enddatum wird nur angegeben, wenn es sich von Startdatum unterscheidet.
        if ( moment( opinion.dateFrom ).format( 'DD.MM.YYYY' ) == moment( opinion.dateTill ).format( 'DD.MM.YYYY' ) )
            pagedata = pagedata.replace( /\{\{PRJ_DATUM_PLAN\}\}/  , '' );
        else
            pagedata = pagedata.replace( /\{\{PRJ_DATUM_PLAN\}\}/  , ` - ${moment( opinion.dateTill ).format( 'DD.MM.YYYY' )}` );
    }
    else {
        pagedata = pagedata.replace( /\{\{PRJ_Datum_Start\}\}/ , opinion.dateFrom.toLocaleDateString( 'de-DE' ) );
        // Enddatum wird nur angegeben, wenn es sich von Startdatum unterscheidet.
        if ( opinion.dateFrom.toLocaleDateString( 'de-DE' ) == opinion.dateTill.toLocaleDateString( 'de-DE' ) )
            pagedata = pagedata.replace( /\{\{PRJ_DATUM_PLAN\}\}/  , '' );
        else
            pagedata = pagedata.replace( /\{\{PRJ_DATUM_PLAN\}\}/  , ` - ${opinion.dateTill.toLocaleDateString( 'de-DE' )}` );
    }
    
    // Teilnehmer.
    let help = '';
    if ( opinion.participants
      && opinion.participants.length > 0 ) {
        opinion.participants.forEach( element => {
            help += GetParticipant( element ); 
        });
        if ( !helper.EmptyString( help ) )
            help = `<ul class="part">${help}</ul>`; 
    }
    pagedata = pagedata.replace( '{{participants}}' , help );

    // Sachverständige.
    pagedata = pagedata
    .replace( /\{\{expertno1\}\}/ , GetExpert( opinion.expert1 ) )
    .replace( /\{\{expertno2\}\}/ , GetExpert( opinion.expert2 ) );

    return pagedata;
}

const GetAbbreviationsPage = () => {
    const pathFile = path.join( __dirname , 'Files' , 'page_abbreviations.html' );
    const pagedata = fs.readFileSync( pathFile , 'utf-8' );
    return pagedata;
}

const FilterOpDetailsLayerA = ( opDetail ) => {
    return ( opDetail
      && !opDetail.deleted
      && !opDetail.finallyRemoved
      && helper.EmptyString( opDetail.refParentDetail ) );
      //&& opDetail.type == 'HEADING' );// Wird hier nicht geprüft, ansonsten würden LayerA Details von jedem anderen type nie angezeigt!
}

/*const GetPageClass = ( opDetail ) => {
    //`<div class="page...">`;
    let pageClass = '';
    if ( opDetail.pagebreakBefore ) {
        if ( opDetail.pagebreakAfter )
            pageClass = 'page-breaks';
        else
            pageClass = 'page-breakBefore';
    }
    else if ( opDetail.pagebreakAfter )
        pageClass = 'page-breakAfter';
    else
        pageClass = 'page-noBreak';    

    return pageClass;
}*/

const GetHeadingRegExp = ( ToCPoint ) => {
    return {
        name: ToCPoint,
        page: ''
    };
}

const GetToCItemDepth = ( chapter ) => {
    chapter = String( chapter );
    let countedPoints = 0;
    let index = chapter.indexOf( '.' , 0 )
    while ( index >= 0 ) {
        countedPoints++;
        index = chapter.indexOf( '.' , index + 1 )
    }
    if ( countedPoints > 7 )
        countedPoints = 7;// In CSS (basic.css) maximal eingestellte Einrückung.
    return `item depth-${countedPoints}`;
}

const GetChildrenToc = ( opDetails , parentID , chapter , print , ToCPageNos , writePageNoToArray , headingsArray ) => {
    // Für das Inhaltsverzeichnis, ToC = table of content.
    let text = '';
    //let title = '';
    // "Holt" alle Children zum übergebenen Gutachten-Detail (=parentID).
    let subChapterNo = 1;
    const detailArray = opDetails.filter( opDetail => {
        return ( opDetail
                && !opDetail.deleted
                && !opDetail.finallyRemoved
                && opDetail.refParentDetail == parentID
                //&& opDetail.type == 'HEADING' );
                && opDetail.showInToC
                && !helper.EmptyString( opDetail.printTitle ) );
    });
    if ( detailArray.length == 0 )
        return '';        

    detailArray.forEach( currentDetailValue => {
        text += '<div class="toc_Point">';

        /*if ( !helper.EmptyString( currentDetailValue.printTitle ) )
            title = currentDetailValue.printTitle;
        else
            title = currentDetailValue.title;*/
        let pageNo = '';
        if ( ToCPageNos
          && !writePageNoToArray ) {
            // Seitennummern (der IDs) ins Inhaltsverzeichnis schreiben.
            const pageNoElement = headingsArray.find( (element) => {
                //return ( element.name == `${chapter}.${subChapterNo} ${currentDetailValue.printTitle}` );
                return ( element.name == currentDetailValue._id );
            });
            if ( pageNoElement )
                pageNo = pageNoElement.page;
            if ( print )
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} ${currentDetailValue.printTitle}</b></span>`;
            else
                //text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${helper.GetID( chapter + '.' + subChapterNo )}">${currentDetailValue.printTitle}</a></b></span>`;
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${currentDetailValue._id}">${currentDetailValue.printTitle}</a></b></span>`;
            text += '<span class="dots"></span>';
            text += `<span class="pageNo">${pageNo}</span>`;
        }
        else if ( writePageNoToArray ) {
            //headingsArray.push( GetHeadingRegExp( `${chapter}.${subChapterNo} ${currentDetailValue.printTitle}` ) );
            headingsArray.push( GetHeadingRegExp( currentDetailValue._id ) );
            text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} ${currentDetailValue._id}</b></span>`;
        }
        else {
            if ( print )
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} ${currentDetailValue.printTitle}</b></span>`;
            else
                //text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${helper.GetID( chapter + '.' + subChapterNo )}">${currentDetailValue.printTitle}</a></b></span>`;
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${currentDetailValue._id}">${currentDetailValue.printTitle}</a></b></span>`;
        }

        text += '</div>';
        text += GetChildrenToc( opDetails , currentDetailValue._id , `${chapter}.${subChapterNo}` , print , ToCPageNos , writePageNoToArray , headingsArray );
        subChapterNo += 1;
    });
    return text;
}

const CanHaveChildren = ( opDetail ) => {
    if ( opDetail.type == 'HEADING'
      || opDetail.type == 'QUESTION'
      || opDetail.type == 'PICTURECONTAINER'
      /**/|| opDetail.type == 'ANSWER' )
        return true;
    else
        return false;
}

const RenderPictures = ( opDetail , images ) => {
    let text = '';
    if ( opDetail.type == 'PICTURE'
      && opDetail.files 
      && opDetail.files.length > 0 ) {
        opDetail.files.forEach( file => {
            let filePath = file.path;
            let fileExtension = file.extension;

            if ( images
              && images.length > 0 ) {
                const image = images.find( ( element ) => {
                    return ( element._id == file._id );
                });
                if ( image 
                  && image.meta
                  && !helper.EmptyString( image.meta.annotStateImageId ) ) {
                    // Geänderte/Markierte Bilder sind immer als jpg gespeichert (von markerjs)!
                    filePath = image._storagePath + '/' + image.meta.annotStateImageId + '.jpg';//image.extensionWithDot;
                    fileExtension = 'jpg';//image.extension;
                }
            }

            if ( !helper.EmptyString( filePath )
              && !helper.EmptyString( fileExtension )
              && ( fileExtension == 'jpg'
                || fileExtension == 'jpeg'
                || fileExtension == 'png' ) ) {
                  if ( fs.existsSync( filePath ) ) {
                      const pic = fs.readFileSync( filePath );
                      //text += `<img style="width: 8cm;" alt="[Das hinterlegte Bild \'${file.name}\' kann nicht geladen werden.]" src="data:image/png;base64,${Buffer.from( pic ).toString('base64')}">`;
                      text += `<img alt="[Das hinterlegte Bild \'${file.name}\' kann nicht geladen werden.]" src="data:image/${fileExtension};base64,${Buffer.from( pic ).toString('base64')}">`;
                  }
                  else
                      console.log( `Bilddatei \'${file.name}\' nicht vorhanden.` );
              }

            //-----------------------
            //console.log( file );
            /*let filePath = file.path;
            let fileExtension = file.extension;
            //let fileName = file.name;
            if ( file.meta
              && file.meta.annotStateImageID ) {
                filePath = file._storagePath + file.meta.annotStateImageID + file.extensionWithDot;
            }

            if ( !helper.EmptyString( filePath )
              && !helper.EmptyString( fileExtension )
              && ( fileExtension == 'jpg'
                || fileExtension == 'jpeg'
                || fileExtension == 'png' ) ) {
                if ( fs.existsSync( filePath ) ) {
                    const pic = fs.readFileSync( filePath );
                    //text += `<img style="width: 8cm;" alt="[Das hinterlegte Bild \'${file.name}\' kann nicht geladen werden.]" src="data:image/png;base64,${Buffer.from( pic ).toString('base64')}">`;
                    text += `<img alt="[Das hinterlegte Bild \'${file.name}\' kann nicht geladen werden.]" src="data:image/${fileExtension};base64,${Buffer.from( pic ).toString('base64')}">`;
                }
                else
                    console.log( `Bilddatei \'${file.name}\' nicht vorhanden.` );
            }*/
        });
    }
    return text;
}

const GetMainChapterNo = ( chapter ) => {
    chapter = String( chapter );
    const index = chapter.indexOf( '.' , 0 )
    if ( index > 0 )
        chapter = chapter.slice( 0 , index );
    return chapter;
}

const GetTodoItems = ( detailsTodoList , /*chapter ,*/ questionChapters ) => {
    // "Holt" alle TodoItems zum übergebenen Gutachten-Detail (=parentID) des übergeordneten Typs TODOLIST.
    // detailsTodoList sollte alle aktiven Gutachten-Details des Typs "QUESTION" mit einer Handlungsempfehlung (actionText) enthalten, sortiert nach actionPrio.
    if ( !detailsTodoList
      || detailsTodoList.length == 0 )
        return '';
    let actionHead = '';
    let text = '';
    const actionCodes = require( './constData/actioncodes' ).actionCodes;
    detailsTodoList.forEach( ( item , index ) => {
        if ( item.actionCode
          && actionHead != item.actionCode ) {
            actionHead = item.actionCode;
            //Neue Überschrift.
            text += `<tr class="mbac-item-type-todolist-item-head ${item.actionCode}">`;
            text += `<td colspan="2">${actionCodes[ item.actionCode ].longtext} - ${actionCodes[ item.actionCode ].text}</td>`;
            text += '</tr>';
        }
        text += '<tr class="mbac-item-type-todolist-item">';
        text += `<td>${index+1}</td>`;
        let chapterNo = '';
        const chap = questionChapters.find( ( element ) => {
            return ( element._id == item._id );
        });
        if ( chap )
            chapterNo = chap.chapter;
        text += `<td class="todo-item">${item.actionText} (<a href="#${item._id}">siehe ${chapterNo}</a>)</td>`;
        text += '</tr>';
    });
    return text;
}

const GetChildren = ( opDetails , detailsTodoList , images , parentID , chapter , tmp , questionChapters ) => {
    // "Holt" alle Children zum übergebenen Gutachten-Detail (=parentID).
    let text = '';
    let subChapterNo = 1;
    let questSubChapterNo = 1;//Für die Kapitelnummern der Fragen für die Todo-List.
    const detailArray = opDetails.filter( opDetail => {
        return ( opDetail
              && !opDetail.deleted
              && !opDetail.finallyRemoved
              && opDetail.refParentDetail == parentID );
    });
    if ( detailArray.length == 0 )
        return ''; 

    let htmlContent = '';
    detailArray.forEach( ( currentDetailValue , index ) => {
        if ( currentDetailValue.type == 'PAGEBREAK' ) {
            if ( !currentDetailValue.deleted
              && !currentDetailValue.finallyRemoved )
                text += '<div class="page-breaks"></div>';
                //text += '<div class="page-breaks" />';
        }
        else {
            const canHaveChildren = CanHaveChildren( currentDetailValue );
            //text += `<div class="${GetPageClass( currentDetailValue )}">`;
            //text += '<div>';
            //if ( !helper.EmptyString( currentDetailValue.htmlContent ) && currentDetailValue.type != 'PICTURE' ) {
            if ( !helper.EmptyString( currentDetailValue.htmlContent ) ) {
                htmlContent = currentDetailValue.htmlContent
                .replace( /\{\{XparentPosition\}\}/ , `${chapter}.` )
                .replace( /\{\{printParentPosition\}\}/ , `${chapter}.` )
                .replace( /\{\{Xposition\}\}/ , `${subChapterNo}` )
                .replace( /\{\{printPosition\}\}/ , `${questSubChapterNo}` );
                if ( tmp && !helper.EmptyString( currentDetailValue.printTitle ) )
                    htmlContent = htmlContent.replace( new RegExp( helper.escapeRegExp( currentDetailValue.printTitle ) ) , currentDetailValue._id );
                if ( currentDetailValue.type == 'PICTURECONTAINER' )
                    htmlContent = htmlContent.replace( /#/ , 'Nr.' );
                if ( currentDetailValue.type == 'PICTURE' ) {
                    htmlContent = htmlContent
                    .replace( /\{\{index\}\}/ , `${GetMainChapterNo( chapter )}.${index + 1}` )
                    .replace( /\{\{pictures\}\}/ , RenderPictures( currentDetailValue , images ) );
                    //.replace( /\{\{pictures\}\}/ , `Bilder...` );
                }      
                else if ( currentDetailValue.type == 'TODOLIST' ) {
                    htmlContent = htmlContent
                    .replace( /\{\{todoitems\}\}/ , GetTodoItems( detailsTodoList , /*`${chapter}.${subChapterNo}` ,*/ questionChapters ) )
                }
                if ( canHaveChildren ) {
                    htmlContent = htmlContent
                    .replace( /\{\{childContent\}\}/ , GetChildren( opDetails , detailsTodoList , images , currentDetailValue._id , `${chapter}.${subChapterNo}` , tmp , questionChapters ) );
                }
                text += htmlContent;

                if ( currentDetailValue.type == 'QUESTION' ) {
                    // Speicherung der Kapitelnummern der Fragen für die Todo-List:
                    questionChapters.push(
                        {
                            _id: currentDetailValue._id,
                            chapter: `${chapter}.${questSubChapterNo}`
                        });
                    questSubChapterNo += 1;
                }
            }
            /*else {
                //text += helper.GetFormatText( currentDetailValue , `${chapter}.${subChapterNo}` , 'B' );
                text += helper.GetFormatText2( currentDetailValue , 'B' )
                .replace( /\{\{XparentPosition\}\}/ , `${chapter}.` )
                .replace( /\{\{Xposition\}\}/ , `${subChapterNo}` );
            }*/
            //text += '</div>';
            // Weitere OpinionDetails zu diesem OpinionDetail.
            /*if ( !canHaveChildren )
                // Wenn canHaveChildren = true, wird {{childContent}} verwendet.
                text += GetChildren( opDetails , currentDetailValue._id , `${chapter}.${subChapterNo}` , tmp );*/
            //if ( currentDetailValue.type == 'HEADING' )
            if ( ( currentDetailValue.showInToC
                || currentDetailValue.type == 'HEADING' )
              && !helper.EmptyString( currentDetailValue.printTitle ) )
                subChapterNo += 1;
        }
    });
    return text;
}

const GetDynContent = ( opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , tmp ) => {
    // Inhalt ab Seite 3.
    if ( !opinionDetails )
        return '';
    //let title = '';
    let text = ''; 
    let chapterNo = 1;

    opinionDetails.sort( helper.opinionDetailsSortASC );
    const opDetailLayerA = opinionDetails.filter( FilterOpDetailsLayerA );
    if ( hasToC ) {
        text += '<div class="page-breaks">';
        text += `<h2 class="ueb2">${ToC_constString}</h2>`;
                    //<p><b>Inhaltsverzeichnis</b></p>`;
        //////////////
        // Test zum Einfügen eines Bildes.
        //text += `<img style="width: 300px;" src="file:/C:/Users/marc.tomaschoff/meteor/html-create/Files/MEBEDO_LOGO_PRINT_CMYK.jpg" alt="TEST">`;
        //text += `<img style="width: 50mm;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png" alt="TEST">`;

        // Funktioniert NICHT in HTML5-to-pdf!
        //text += `<img style="width: 50mm;" src="https://mebedo-ac.de/wp-content/uploads/2020/10/MEBEDO_LOGO_PRINT_RGB-300x88.jpg" alt="TEST">`;

        /*let fs = require( 'fs' );

        //let bitmap = fs.readFileSync( 'C:/Users/marc.tomaschoff/meteor/html-create/Files/MEBEDO_LOGO_PRINT_CMYK.jpg');
        let bitmap = fs.readFileSync( 'C:/Users/marc.tomaschoff/meteor/html-create/Files/orange_FooterBlock.png');
            
        text += `<img src="data:image/png;base64,${new Buffer(bitmap).toString('base64')}">`;
        console.log(`<img src="data:image/png;base64,${new Buffer(bitmap).toString('base64')}">`);
        //besser:
        console.log(`<img src="data:image/png;base64,${Buffer.from(bitmap).toString('base64')}">`);*/
        
        // Funktioniert in HTML5-to-pdf!
        /*let fs = require( 'fs' );
        let header_image = fs.readFileSync( './Files/header_image.html' , 'utf-8' );
        text += header_image;*/
        //////////////
        let writePageNoToArray = false;//Variable, ob Seitennummern in Array geschrieben werden sollen = nur für 1. temporären Durchgang.
        if ( ToCPageNos
          && ( !headingsArray
            || headingsArray.length == 0 ) ) {
            if ( hasAbbreviationsPage )
                headingsArray.push( GetHeadingRegExp( AbbreviationsPage_constString ) );
            writePageNoToArray = true;
        }
        if ( hasAbbreviationsPage ) {
            // Abkürzungsverzeichnis im Inhaltsverzeichnis.
            text += '<div class="toc_Point">';
            let pageNo = '';
            if ( ToCPageNos
              && !writePageNoToArray ) {
                // Seitennummern ins Inhaltsverzeichnis schreiben.
                const pageNoElement = headingsArray.find( ( element ) => {
                    return ( element.name == AbbreviationsPage_constString );
                });
                if ( pageNoElement )
                    pageNo = pageNoElement.page;
                if ( print )
                    text += `<span class="item"><b>${AbbreviationsPage_constString}</b></span>`;
                else
                    text += `<span class="item"><b><a href="#0">${AbbreviationsPage_constString}</a></b></span>`;
                text += '<span class="dots"></span>';
                text += `<span class="pageNo">${pageNo}</span>`;
            }
            else {
                if ( print )
                    text += `<span class="item"><b>${AbbreviationsPage_constString}</b></span>`;
                else
                    text += `<span class="item"><b><a href="#0">${AbbreviationsPage_constString}</a></b></span>`;
            }
            text += '</div>';
        }

        // 1. Durchgang für Inhaltsverzeichnis.
        opDetailLayerA.forEach( currentDetail => {
            //if ( currentDetail.type == 'HEADING' ) {
            // Prüfung nach Kriterien showInToC = true und printTitle nicht leer.
            if ( currentDetail.showInToC
              && !helper.EmptyString( currentDetail.printTitle ) ) {
                text += '<div class="toc_Point">';
                
                /*if ( !helper.EmptyString( currentDetail.printTitle ) )
                    title = currentDetail.printTitle;
                else
                    title = currentDetail.title;*/
                let pageNo = '';
                if ( ToCPageNos
                  && !writePageNoToArray ) {
                    // Seitennummern (der IDs) ins Inhaltsverzeichnis schreiben.
                    const pageNoElement = headingsArray.find( ( element ) => {
                        //return ( element.name == `${chapterNo}. ${currentDetail.printTitle}` );
                        return ( element.name == currentDetail._id );
                    });
                    if ( pageNoElement )
                        pageNo = pageNoElement.page;
                    if ( print )
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. ${currentDetail.printTitle}</b></span>`;
                    else
                        //text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${chapterNo}">${currentDetail.printTitle}</a></b></span>`;
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${currentDetail._id}">${currentDetail.printTitle}</a></b></span>`;
                    text += '<span class="dots"></span>';
                    text += `<span class="pageNo">${pageNo}</span>`;
                }
                else if ( writePageNoToArray ) {
                    //headingsArray.push( GetHeadingRegExp( `${chapterNo}. ${currentDetail.printTitle}` ) );
                    headingsArray.push( GetHeadingRegExp( currentDetail._id ) );
                    text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. ${currentDetail._id}</b></span>`;
                }
                else {
                    if ( print )
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. ${currentDetail.printTitle}</b></span>`;
                    else
                        //text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${chapterNo}">${currentDetail.printTitle}</a></b></span>`;
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${currentDetail._id}">${currentDetail.printTitle}</a></b></span>`;
                }                

                text += '</div>';
                // Weitere OpinionDetails zu diesem OpinionDetail.
                text += GetChildrenToc( opinionDetails , currentDetail._id , chapterNo , print , ToCPageNos , writePageNoToArray , headingsArray );
                chapterNo += 1;
            }
        });
        text += '</div>';
    }

    // Abkürzungsverzeichnis.
    if ( hasAbbreviationsPage )
        text += GetAbbreviationsPage();
    else
        text += '<div class="page-breaks"></div>';

    // 2. Durchgang für Inhalt: Einzelne Kapitel.
    chapterNo = 1;
    let htmlContent = '';
    let questionChapters = [];// Für die Abschlussbetrachtung.
    opDetailLayerA.forEach( ( currentDetail , index ) => {
        if ( currentDetail.type == 'PAGEBREAK' ) {
            if ( !currentDetail.deleted
              && !currentDetail.finallyRemoved )
                text += '<div class="page-breaks"></div>';
                //text += '<div class="page-breaks" />';
        }
        else {
            const canHaveChildren = CanHaveChildren( currentDetail );
            //text += `<div class="${GetPageClass( currentDetail )}">`;
            //text += '<div>'
            //if ( !helper.EmptyString( currentDetail.htmlContent ) && currentDetail.type != 'PICTURE' ) {
            if ( !helper.EmptyString( currentDetail.htmlContent ) ) {
                htmlContent = currentDetail.htmlContent
                .replace( /\{\{XparentPosition\}\}/ , '' )
                .replace( /\{\{printParentPosition\}\}/ , '' )
                .replace( /\{\{Xposition\}\}/ , `${chapterNo}.` )
                .replace( /\{\{printPosition\}\}/ , `${chapterNo}.` );
                if ( tmp && !helper.EmptyString( currentDetail.printTitle ) )
                    htmlContent = htmlContent.replace( new RegExp( helper.escapeRegExp( currentDetail.printTitle ) ) , currentDetail._id );
                if ( currentDetail.type == 'PICTURECONTAINER' )
                    htmlContent = htmlContent.replace( /#/ , 'Nr.' );
                if ( currentDetail.type == 'PICTURE' ) {
                    htmlContent = htmlContent
                    .replace( /\{\{index\}\}/ , `${chapterNo}.${index + 1}` )
                    .replace( /\{\{pictures\}\}/ , RenderPictures( currentDetail , images ) );
                    //.replace( /\{\{pictures\}\}/ , `Bilder...` );
                }
                else if ( currentDetail.type == 'TODOLIST' ) {
                    htmlContent = htmlContent
                    .replace( /\{\{todoitems\}\}/ , GetTodoItems( detailsTodoList , /*chapterNo ,*/ questionChapters ) )
                }
                if ( canHaveChildren ) {
                    htmlContent = htmlContent
                    .replace( /\{\{childContent\}\}/ , GetChildren( opinionDetails , detailsTodoList , images , currentDetail._id , chapterNo , tmp , questionChapters ) );
                }
                text += htmlContent;
                
                if ( currentDetail.type == 'QUESTION' ) {
                    // Speicherung der Kapitelnummern der Fragen für die Todo-List:
                    questionChapters.push(
                        {
                            _id: currentDetail._id,
                            chapter: chapterNo
                        });
                }
            }
            /*else {
                //text += helper.GetFormatText( currentDetail , chapterNo , 'A' );
                text += helper.GetFormatText2( currentDetail , 'A' )
                .replace( /\{\{XparentPosition\}\}/ , '' )
                .replace( /\{\{Xposition\}\}/ , `${chapterNo}.` );
            }*/
            //text += '</div>';
            // Weitere OpinionDetails zu diesem OpinionDetail.
            /*if ( !canHaveChildren )
                // Wenn canHaveChildren = true, wird {{childContent}} verwendet.
                text += GetChildren( opinionDetails , currentDetail._id , chapterNo , tmp );*/
            
            chapterNo += 1;
        }
    });
    return text;
}

const GetBody = ( opinion, opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , tmp ) => {
    return '<body>'
         + GetFirstPage()
         + GetSecondPage( opinion )
         + GetDynContent( opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , tmp )
         + '</body>';
}

const ReplaceOpinionVariables = ( htmlText , opinion ) => {
    // Die im Gutachten selbst definierten Variablen.
    if ( opinion.userVariables
      && opinion.userVariables.length > 0 ) {
        opinion.userVariables.forEach( element => {
            htmlText = htmlText
            .replace( new RegExp( '\{\{' + helper.escapeRegExp( element.name ) + '\}\}' , 'g' ) , element.value );
        });
    }

    //-----
    // Sind Variablen ersetzt worden? Wenn nein, Defaultwerte verwenden:
    // Seite 1.
    const docTitle = 'Gutachtliche Stellungnahme';
    const docSubTitle = 'Sicherheit in der Elektrotechnik';
    const docAdditionalText1 = 'Schwerpunkt ist der Aufbau einer rechtssicheren';
    const docAdditionalText2 = 'Organisationsstruktur im Bereich der Elektrotechnik';
    const doclocationLongText = '';

    htmlText = htmlText
    .replace( /\{\{!Titel\}\}/ , docTitle )
    .replace( /\{\{!Untertitel\}\}/ , docSubTitle )
    .replace( /\{\{!ZusatztextZeile1\}\}/ , docAdditionalText1 )
    .replace( /\{\{!ZusatztextZeile2\}\}/ , docAdditionalText2 )
    .replace( /\{\{!StandortLangtext\}\}/ , doclocationLongText );

    // Name des Auftraggebers auf Seite 2.
    htmlText = htmlText
    .replace( /\{\{!AuftraggeberName\}\}/ , '' );//'opinion.customer.contact_person' );
    //-----

    return htmlText;
}

const ReplaceInternalVariables = ( htmlText , opinion ) => {
    // Ersetzen der "internen" Variablen.
    // ${Firma}
    htmlText = htmlText.replace( /\$\{Firma\}/g , opinion.customer.name );
    // ${Gutachtennummer}
    htmlText = htmlText.replace( /\$\{Gutachtennummer\}/g , opinion.opinionNo );
    // ${Druckdatum}
    htmlText = htmlText.replace( /\$\{Druckdatum\}/g , helper.GetTodayDateString() );
    // ${GutachterName1}
    htmlText = htmlText.replace( /\$\{GutachterName1\}/g , GetExpert( opinion.expert1 , false ) );
    // ${GutachterName2}
    htmlText = htmlText.replace( /\$\{GutachterName2\}/g , GetExpert( opinion.expert2 , false ) );
    // ${GutachterName1Full}
    htmlText = htmlText.replace( /\$\{GutachterName1Full\}/g , GetExpert( opinion.expert1 ) );
    // ${GutachterName2Full}
    htmlText = htmlText.replace( /\$\{GutachterName2Full\}/g , GetExpert( opinion.expert2 ) );

    return htmlText;
}

const ReplaceVariables = ( htmlText , opinion ) => {
    // Replace der im Gutachten verwendeten Variablen.
    htmlText = ReplaceOpinionVariables( htmlText , opinion );
    htmlText = ReplaceInternalVariables( htmlText , opinion );
    return htmlText;
}

const generateHTMLText = ( opinion , opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , tmp = false ) => {
    return ReplaceVariables( GetBody( opinion , opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , tmp ) , opinion );
}

module.exports = { generateHTMLText };