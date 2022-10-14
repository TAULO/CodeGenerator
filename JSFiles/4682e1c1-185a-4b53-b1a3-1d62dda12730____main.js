/////////////////////////// UTILITIES ///////////////////////////
    // Converts the passed string to title case
    // ex: toTitleCase('john adams') returns 'John Adams'
    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    /////////////////////////// END UTILITES ///////////////////////////

    /////////////////////////// RENDERERS ///////////////////////////
    const apiBaseUrl = 'https://fireworks-directory-api.herokuapp.com'; // Base URL of the API

    // Opens the system dialer to call the extension passed in
    // If there is more than one extension in the string passed,
    // it defaults to calling the first one
    const callExtension = ext => {
        let firstExt = ext;
        if (ext.search(' ') !== -1)
            firstExt = ext.substring(0, ext.search(' '));
        window.open(`tel:${firstExt}`);
    };

    // Generate the svg required for each element below
    const generateSvg = ext => {
        const phoneSvg = `<svg extension='${ext}' class='phone-svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' 
                            id='Capa_1' x='0px' y='0px' width='20px' height='20px' viewBox='0 0 891.024 891.024' style='enable-background:new 0 0 891.024 891.024;' xml:space='preserve'
                            alt='Call them'>
                            <g>
                                <path d='M2.8,180.875c46.6,134,144.7,286.2,282.9,424.399c138.2,138.2,290.4,236.301,424.4,282.9c18.2,6.3,38.3,1.8,52-11.8   
                                l92.7-92.7l21.6-21.6c19.5-19.5,19.5-51.2,0-70.7l-143.5-143.4c-19.5-19.5-51.2-19.5-70.7,0l-38.899,38.9   
                                c-20.2,20.2-52.4,22.2-75,4.6c-44.7-34.8-89-73.899-131.9-116.8c-42.9-42.9-82-87.2-116.8-131.9c-17.601-22.6-15.601-54.7,4.6-75   
                                l38.9-38.9c19.5-19.5,19.5-51.2,0-70.7l-143.5-143.5c-19.5-19.5-51.2-19.5-70.7,0l-21.6,21.6l-92.7,92.7   
                                C1,142.575-3.5,162.675,2.8,180.875z'/>
                            </g>
                        </svg>`
        return phoneSvg;
    };

    // Renders the directory by department from the passed json object, sorting first alphabetically,
    // then by number of people in the department, then by whether their name should be bolded, then by row
    // weight. Bolded names and names with a lower row weight appear at the top of each department
    const renderDepartmentDirectory = async (json, forPrint) => {

        // Sort the departments alphabetically and then by number
        // of people in the department
        let alphabetical = Object.keys(json).sort().sort(
            (keyA, keyB) => {
                return Object.keys(json[keyB]).length - Object.keys(json[keyA]).length
            }
        ).reduce(
            (obj, key) => { 
                obj[key] = json[key]; 
                return obj;
            }, 
            {}
        );

        // Sort each department alphabetically and then by whether
        // the name should be in bold
        let keys = Object.keys(alphabetical);
        const tempObj = {}
        for (const index in keys) {
            const departmentObj = alphabetical[keys[index]];
            const sortedDepartmentObj = Object.keys(departmentObj).sort().sort(
                (keyA, keyB) => {
                    if (departmentObj[keyA].bold && !departmentObj[keyB].bold) return -1;
                    else if (!departmentObj[keyA].bold && departmentObj[keyB].bold) return 1;
                    else return 0;
                }
            ).sort(
                (keyA, keyB) => {
                    return parseInt(departmentObj[keyA].rowWeight) - parseInt(departmentObj[keyB].rowWeight);
                }
            ).reduce(
                (obj, key) => {
                    if (!departmentObj[key].hidden || departmentObj[key].hidden === undefined) {
                        obj[key] = departmentObj[key]; 

                    }
                    return obj;
                }, 
                {}
            );
            if (Object.keys(sortedDepartmentObj).length !== 0) {
                tempObj[keys[index]] = sortedDepartmentObj;
            }
        }
        alphabetical = tempObj;
        keys = Object.keys(alphabetical);

        // Group the keys in groups of 3 to render the table
        let tempArr = [];
        const groupedKeysArr = [];
        let i;
        for (i = 0; i < keys.length; i++) {
            if (i % 3 === 0 && i != 0) {
                groupedKeysArr.push(tempArr);
                tempArr = [];
            }
            tempArr.push(keys[i]);
        }
        if (i === keys.length) groupedKeysArr.push(tempArr);

        // Create the table rows and populate with data
        const tableArr = [];
        groupedKeysArr.map(header => {
            const headerHTML = document.createElement('tr');
            headerHTML.innerHTML = `
                ${header[0] !== '' && header[0] !== undefined ? `<th class=${header[0].toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '')}>${header[0]}</th>` : ''}
                ${header[1] !== '' && header[1] !== undefined ? `<th class=${header[1].toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '')}>${header[1]}</th>` : ''}
                ${header[2] !== '' && header[2] !== undefined ? `<th class=${header[2].toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '')}>${header[2]}</th>` : ''}
            `;
            tableArr.push(headerHTML);
            const header0List = alphabetical[header[0]];
            const header1List = alphabetical[header[1]];
            const header2List = alphabetical[header[2]];
            const max = Math.max(
                (header0List !== undefined ? Object.keys(header0List).length : 0), 
                (header1List !== undefined ? Object.keys(header1List).length : 0), 
                (header2List !== undefined ? Object.keys(header2List).length : 0)
            )
            for (let i = 0; i < max; i++) {
                const row = document.createElement('tr');
                const class0 = header[0]?.toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '');
                const class1 = header[1]?.toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '');
                const class2 = header[2]?.toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '');
                row.innerHTML = `
                    ${header0List !== undefined ? `<td ${(header0List[Object.keys(header0List)[i]]?.mappable ? `person='${Object.keys(header0List)[i].toLowerCase().replaceAll(' ', '_')}'
                        class='clickable ${class0} person-data'` : `class='${class0} person-data'`)}
                        style='${header0List[Object.keys(header0List)[i]]?.bold ? 'font-weight: bold' : ''}'>
                        ${Object.keys(header0List)[i] ? header0List[Object.keys(header0List)[i]].extension + ' - ' + Object.keys(header0List)[i] : ''} 
                        ${Object.keys(header0List)[i] && !forPrint ? generateSvg(header0List[Object.keys(header0List)[i]].extension) : ''}
                    </td>` : ''}

                    ${header1List !== undefined ? `<td ${(header1List[Object.keys(header1List)[i]]?.mappable ? `person='${Object.keys(header1List)[i].toLowerCase().replaceAll(' ', '_')}'
                        class='clickable ${class1} person-data'` : `class='${class1} person-data'`)}
                        style='${header1List[Object.keys(header1List)[i]]?.bold ? 'font-weight: bold' : ''}'>
                        ${Object.keys(header1List)[i] ? header1List[Object.keys(header1List)[i]].extension + ' - ' + Object.keys(header1List)[i] : ''}
                        ${Object.keys(header1List)[i] && !forPrint ? generateSvg(header1List[Object.keys(header1List)[i]].extension) : ''}
                    </td>` : ''}

                    ${header2List !== undefined ? `<td ${(header2List[Object.keys(header2List)[i]]?.mappable ? `person='${Object.keys(header2List)[i].toLowerCase().replaceAll(' ', '_')}'
                        class='clickable ${class2} person-data'` : `class='${class2} person-data'`)}
                        style='${header2List[Object.keys(header2List)[i]]?.bold ? 'font-weight: bold' : ''}'>
                        ${Object.keys(header2List)[i] ? header2List[Object.keys(header2List)[i]].extension + ' - ' + Object.keys(header2List)[i] : ''}
                        ${Object.keys(header2List)[i] && !forPrint ? generateSvg(header2List[Object.keys(header2List)[i]].extension) : ''}
                    </td>` : ''}
                `;
                tableArr.push(row);
            }
        });

        // Create the table element and append the rows
        const table = document.createElement('table');
        table.id = 'corporate-directory'
        for (let i = 0; i < tableArr.length; i++) {
            table.appendChild(tableArr[i]);
        }

        // Append the table to the proper div
        if(!forPrint) document.getElementById('department-directory').appendChild(table);
        else return table;
    }

    // Assigns names to each of the offices by first determining the floor they are on and thus which map area to choose
    // and changing the labelText attribute of the element
    const assignOffices = async () => {
        
        // Get data from the api and parse into a JSON object
        const response = await fetch(apiBaseUrl + '/api/office_mapping');
        const json = await response.json();

        // Find the proper map, select the correct map area, and change the labelText attribute
        // The autoAssigned attribute is used simply for tracking which names were automatically
        // labeled by this script
        for (const key in json) {
            const map = document.getElementById(`by-office${json[key].floor === '1' ? '1' : ''}`);
            map.querySelector(`area[title='${json[key].office}']`).setAttribute('labelText', toTitleCase(key));
            map.querySelector(`area[title='${json[key].office}']`).setAttribute('onclick', 'highlightName(this)');
            map.querySelector(`area[title='${json[key].office}']`).setAttribute('autoAssigned', true);
        }
    };

    const renderLabel = (el, center) => {
        const centerArr = getAreaCenter($(el).attr('shape'), $(el).attr('coords'));
        const text = document.createElement('span');
        text.innerText = $(el).attr('labelText').search('0') !== -1 || !$(el).attr('labelText') ?  $(el).attr('title') : $(el).attr('labelText');
        text.className = 'hover-text';
        $(el).parent().parent().append(text);

        // Calculate twice since first calculation is sometimes off, but second is always correct
        text.style['left'] = String(calculateLeftVal(text, centerArr[0]) + 'px');
        text.style['left'] = String(calculateLeftVal(text, centerArr[0]) + 'px');
        text.style['z-index'] = 4;

        if (!center)
            text.style['top'] = String(centerArr[2] - text.offsetHeight - 40 > 0 ? 
                                        centerArr[2] - 40 + 'px' : centerArr[3] + 40 + 'px');
        else if ($(el).hasClass('bump-up'))
            text.style['top'] = String(centerArr[1] - 40) + 'px';
        else
            text.style['top'] = String(centerArr[1]) + 'px';

        return text;
    }

    const drawLabel = el => {
        const text = renderLabel(el);
        liveSpans.push(text);
    }

    const drawEmergencyLabels = el => {
        const text = renderLabel(el, true);
        $(text).addClass('emergency');
    }

    const removeEmergencyLabels = () => {
        $('.emergency').remove();
    }

    let removedAreas = [];

    const drawAreasOnCanvas = (map, className = undefined) => {
        const areas = $(map).children();
        // console.log(areas);
        const canvas = $(map).parent().find('canvas');
        // const canvas = $('#canvas-test');
        const ctx = canvas[0].getContext('2d');
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

        const img = $(map).parent().find('.base-img')[0];
        const scale = img.offsetWidth / (img.naturalWidth || img.width);

        canvas[0].width = img.offsetWidth;
        canvas[0].height = img.offsetHeight;

        areas.each(function() {
            const shape = $(this).attr('shape');
            const coordsArray = $(this).attr('coords').split(',');
            ctx.beginPath();
            if (shape === 'poly') {
                ctx.moveTo(coordsArray[0], coordsArray[1]);
                for (let i = 2; i < coordsArray.length; i += 2) {
                    ctx.lineTo(coordsArray[i], coordsArray[i + 1]);
                }
            }
            else if (shape === 'rect') {
                ctx.rect(coordsArray[0], coordsArray[1], (coordsArray[2] - coordsArray[0])
                        , (coordsArray[3] - coordsArray[1]));
            }
            else if (shape === 'circle') {
                ctx.arc(coordsArray[0], coordsArray[1], coordsArray[2], 0, 2 * Math.PI);
            }
            ctx.closePath();
            ctx.strokeStyle = '#9900FF';
            ctx.lineWidth = 3;
            ctx.stroke();
            if (className && $(this).hasClass('draw')) {
                ctx.fillStyle = 'rgba(153, 0, 255, 0.5)';
                ctx.fill();
            }

            if (className && $(this).hasClass('remove')) {
                drawEmergencyLabels(this);
                const removedArea = {el: $(this), parent: $(this).parent()};
                console.log(removedArea);
                removedAreas.push(removedArea);
                $(this).remove();
            }
        })
    };

    const drawAllOnCanvas = () => {
        console.log('1. ', removedAreas);
        for (const index in removedAreas) {
            console.log($(removedAreas[index].parent));
            console.log($(removedAreas[index].el));
            $(removedAreas[index].parent).append($(removedAreas[index].el));
        }
        removedAreas = [];
        drawAreasOnCanvas($('#by-department1'));
        drawAreasOnCanvas($('#by-department'));
        drawAreasOnCanvas($('#by-office1'));
        drawAreasOnCanvas($('#by-office'));
        drawAreasOnCanvas($('#floor1-tornado-map'), 'draw');
        drawAreasOnCanvas($('#floor2-tornado-map'), 'draw');
        console.log('2. ', removedAreas, '\n\n');
    }

    /////////////////////////// END RENDERERS ///////////////////////////

    /////////////////////////// CALCULATION FUNCS ///////////////////////////

    // Credit to 'https://www.456bereastreet.com/archive/201104/how_to_find_the_center_of_an_area_element_with_javascript/'
    // Gets the center of a map area, modified to return max and min heights to better assign the 
    // coordinates of the popup text
    function getAreaCenter(shape, coords) {
        var coordsArray = coords.split(','),
            center = [];
        if (shape == 'circle') {
            // For circle areas the center is given by the first two values
            center = [parseInt(coordsArray[0]), parseInt(coordsArray[1]), parseInt(coordsArray[1]) - parseInt(coordsArray[2]), parseInt(coordsArray[1]) - parseInt(coordsArray[2])];
        } else {
            // For rect and poly areas we need to loop through the coordinates
            var coord,
                minX = maxX = parseInt(coordsArray[0], 10),
                minY = maxY = parseInt(coordsArray[1], 10);
            for (var i = 0, l = coordsArray.length; i < l; i++) {
                coord = parseInt(coordsArray[i], 10);
                if (i%2 == 0) { // Even values are X coordinates
                    if (coord < minX) {
                        minX = coord;
                    } else if (coord > maxX) {
                        maxX = coord;
                    }
                } else { // Odd values are Y coordinates
                    if (coord < minY) {
                        minY = coord;
                    } else if (coord > maxY) {
                        maxY = coord;
                    }
                }
            }
            center = [parseInt((minX + maxX) / 2, 10), parseInt((minY + maxY) / 2, 10), parseInt(minY, 10), parseInt(maxY, 10)];
        }
        return(center);
    };

    // Calculates the css 'left' style required for the popup text
    const calculateLeftVal = (el, centerX) => {
        const width = el.offsetWidth;
        const halfWidth = width / 2;
        if (centerX - halfWidth < 0) {
            return Math.abs(halfWidth + (centerX / 2));
        }
        else if (centerX + halfWidth > el.parentElement.offsetWidth) {
            return (centerX - Math.abs(centerX + halfWidth - el.parentElement.offsetWidth))
        }
        return centerX;
    }

    /////////////////////////// END CALCULATION FUNCS ///////////////////////////

    /////////////////////////// RESPONSIVENESS ///////////////////////////
    var resizeTime = 0; // Animation time for resize, set to 0 for instantaneous
    var resizeDelay = 50; // How long to wait between window resize events to resize the image

    // Resize each of the images and maps to fit within the correct space
    function resize(maxWidth,maxHeight) {
        var image1 = $('#floor1-department-img'),
            image2 = $('#floor2-department-img'),
            image3 = $('#floor1-office-img'),
            image4 = $('#floor2-office-img'),
            image5 = $('#floor1-tornado-img'),
            image6 = $('#floor2-tornado-img'),
            imgWidth1 = image1.width(),
            imgHeight1 = image1.height(),
            imgWidth2 = image2.width(),
            imgHeight2 = image2.height(),
            imgWidth3 = image3.width(),
            imgHeight3 = image3.height(),
            imgWidth4 = image4.width(),
            imgHeight4 = image4.height(),
            imgWidth5 = image5.width(),
            imgHeight5 = image5.height(),
            imgWidth6 = image6.width(),
            imgHeight6 = image6.height(),
            newWidth1=0,
            newHeight1=0,
            newWidth2=0,
            newHeight2=0,
            newWidth3=0,
            newHeight3=0,
            newWidth4=0,
            newHeight4=0,
            newWidth5=0,
            newHeight5=0,
            newWidth6=0,
            newHeight6=0;

        const maxWidth1 = $(image1).parent().parent().parent().width();
        const maxHeight1 = $(image1).parent().parent().parent().height();
        const maxWidth2 = $(image2).parent().parent().parent().width();
        const maxHeight2 = $(image2).parent().parent().parent().height();

        if (imgWidth1/maxWidth1>imgHeight1/maxHeight1) {
            newWidth1 = maxWidth1;
        } else {
            newHeight1 = maxHeight1;
        }

        if (imgWidth2/maxWidth2>imgHeight2/maxHeight2) {
            newWidth2 = maxWidth2;
        } else {
            newHeight2 = maxHeight2;
        }

        if (imgWidth3/maxWidth1>imgHeight3/maxHeight1) {
            newWidth3 = maxWidth1;
        } else {
            newHeight3 = maxHeight1;
        }

        if (imgWidth4/maxWidth2>imgHeight4/maxHeight2) {
            newWidth4 = maxWidth2;
        } else {
            newHeight4 = maxHeight2;
        }

        if (imgWidth5/maxWidth1>imgHeight5/maxHeight1) {
            newWidth5 = maxWidth1;
        } else {
            newHeight5 = maxHeight1;
        }

        if (imgWidth6/maxWidth2>imgHeight6/maxHeight2) {
            newWidth6 = maxWidth2;
        } else {
            newHeight6 = maxHeight2;
        }

        image1.mapster('resize',newWidth1,newHeight1,resizeTime);   
        image2.mapster('resize',newWidth2,newHeight2,resizeTime); 
        image3.mapster('resize',newWidth3,newHeight3,resizeTime);   
        image4.mapster('resize',newWidth4,newHeight4,resizeTime); 
        image5.mapster('resize',newWidth5,newHeight5,resizeTime);   
        image6.mapster('resize',newWidth6,newHeight6,resizeTime);   
    }

    // Track window resizing events, but only actually call the map resize when the
    // window isn't being resized any more
    function onWindowResize() {
        var curWidth = $(window).width(),
            curHeight = $(window).height(),
            checking=false;
        if (checking) {
            return;
                }
        checking = true;
        window.setTimeout(function() {
            var newWidth = $(window).width(),
            newHeight = $(window).height();
            if (newWidth === curWidth &&
                newHeight === curHeight) {
                resize(newWidth,newHeight);
                drawAllOnCanvas();
            }
            checking=false;
        }, resizeDelay);
    }

    // Bind onWindowResize to the resize event on the window
    $(window).bind('resize',onWindowResize);

    /////////////////////////// END RESPONSIVENESS ///////////////////////////

    /////////////////////////// FUNCTIONALITY ///////////////////////////

    // Initialize vars
    let liveSpans = []; // For tracking which text is currently displayed on the map
    let clicked = false; // For tracking whether an element was clicked to highlight a specific area
                         // this is then used to determine whether to actually highlight on mouseover
                         // or wait for the highlight event triggered to run its course
    let highlightTime = 5000; // The amount of time something (office, name, etc.) should be highlighted
                              // in ms

    // Handle switching which map is currently being used
    const handleMapSwitch = el => {
        const thisId = $(el).attr('id');

        if (thisId !== 'emergencies') {
            $('#emergencies-dropdown').css('height', '0px');
            if (!$(el).hasClass('active')) $(el).addClass('active');
            $(`button:not(#${thisId})`).removeClass('active');
            const otherButtonId = thisId === 'department' ? 'office' : 'department';

            
            // CHECK IF POSSIBLE TO HIGHLIGHT PROGRAMATICALLY

            // if (thisId === 'department') {
            //     $('#by-department area').mapster('select');
            //     $('#by-department1 area').mapster('select');
            // }
            // else {
            //     $('#by-department area').mapster('deselect');
            //     $('#by-department1 area').mapster('deselect');
            // }

            $(`#floor1-tornado`).hide();
            $(`#floor2-tornado`).hide();
            $(`#floor1-fire`).hide();
            $(`#floor2-fire`).hide();

            $(`#floor1-${thisId}`).show();
            $(`#floor2-${thisId}`).show();
            $(`#floor1-${otherButtonId}`).hide();
            $(`#floor2-${otherButtonId}`).hide();

            // Run twice because the first resize is sometimes incorrect, but second is always correct
            onWindowResize();
            onWindowResize();
            removeEmergencyLabels();
            setTimeout(() => {
                drawAllOnCanvas();
            }, 50);
        }
        else {
            if ($('#emergencies-dropdown').css('height') === '0px') $('#emergencies-dropdown').css('height', '4rem');
            else $('#emergencies-dropdown').css('height', '0px');
        }
    };

    // Handle switching to the emergency maps
    const switchToEmergency = el => {
        removeEmergencyLabels();
        $(`#floor1-office`).hide();
        $(`#floor2-office`).hide();
        $(`#floor1-department`).hide();
        $(`#floor2-department`).hide();

        const thisId = $(el).attr('id');
        const otherMapId = thisId === 'fire' ? 'tornado' : 'fire';

        $(`#floor1-${thisId}`).show();
        $(`#floor2-${thisId}`).show();
        $(`#floor1-${otherMapId}`).hide();
        $(`#floor2-${otherMapId}`).hide();

        $('button:not(#emergencies)').removeClass('active');
        $(`#${otherMapId}`).removeClass('active');
        $('#emergencies').addClass('active');
        $(`#${thisId}`).addClass('active');

        // Run twice because the first resize is sometimes incorrect, but second is always correct
        onWindowResize();
        onWindowResize();

        setTimeout(() => {
            drawAllOnCanvas();
        }, 50);
    };

    // Handle highlighting the relavant emergency shelter(s) on the map
    const highlightShelter = el => {
        if (!clicked) {
            const floor = $(el).attr('floor');
            const title = $(el).attr('title');
            const labelText = $(el).attr('labelText');

            // Select the area
            const area = $(`area[floor='${floor}'][title='${title}']:not(area[labelText='${labelText}']) ${floor === '1' ? ', area[labelText*=\'Overflow\'' : ''}`);

            // Trigger the mouseover event and then trigger the mouseout event after a set time
            // This highlights the map area
            setTimeout(() => {
                if (!clicked) {
                    if(liveSpans !== [] && liveSpans) for (let i = 0; i < liveSpans.length; i++) liveSpans[i].remove();
                    area.trigger('mouseover');
                    clicked = true;
                    area.mapster('set', false).mapster('set', true);
                }
            }, 50)
            setTimeout(() => {
                clicked = false;
                area.trigger('mouseout');
                area.mapster('set', false);
                if(liveSpans !== [] && liveSpans) for (let i = 0; i < liveSpans.length; i++) liveSpans[i].remove();
            }, highlightTime + 50);
        }
    };

    // Onclick function to handle highlighting the relavant department in the by department
    // directory
    const highlightRelevantDepartment = el => {
        $('#search-bar').val('');
        $('#search-bar').trigger('keyup');
        
        let departmentEls;
        let labelText = el.getAttribute('labelText').toLowerCase().replaceAll(' ', '_').replaceAll('&', 'and').replaceAll('\'', '');

        // Handle exceptions to department labels
        if (labelText.search('executive') !== -1) {
            labelText = 'executive_offices';
        }
        else if (labelText.search('purchasing') !== -1 || labelText.search('facilities') !== -1) {
            labelText = 'office_services';
        }
        else if (labelText.search('import') !== -1) {
            labelText = 'importing_and_products';
        }
        else if (labelText.search('accounting') !== -1) {
            labelText = 'accounting_-_general';
        }
        else if (labelText.search('legal') !== -1) {
            labelText = 'legal_department';
        }
        else if (labelText.search('retail') !== -1) {
            labelText = 'showroom_management';
        }
        else if (labelText.search('tent') !== -1) {
            labelText = 'tent_operations';
        }
        departmentEls = document.querySelectorAll('.' + labelText + ':not(th)');
        if (labelText.search('advertising') !== -1) {
            departmentEls = [...document.querySelectorAll('.advertising:not(th)')];
            const additionalEls = [...document.querySelectorAll('.digital_marketing_and_social_media:not(th)')]
            departmentEls = departmentEls.concat(additionalEls);
        }
        
        // Find the table rows in the by department table to highlight, scroll into view, and highlight with yellow for 2 seconds
        for (let i = 0; i < departmentEls.length; ++i) {
            if(i === 0) departmentEls[i].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
            departmentEls[i].style.transition = 'all 0.25s ease-in-out';
            departmentEls[i].style.backgroundColor = 'yellow';
            setTimeout(() => {
                departmentEls[i].style.backgroundColor = 'white';
            }, highlightTime);
            setTimeout(() => {
                departmentEls[i].style.transition = '';
            }, highlightTime + 500);
        }
        return;
    };

    // Click handler to determine the targeted element of the click
    const directoryClickHandler = e => {
        if (e.target.tagName.toLowerCase() === 'td') {
            const person = toTitleCase($(e.target).attr('person') ? $(e.target).attr('person').replaceAll('_', ' ') : '');
            if (person !== '') highlightOffice(person);
        }
        else if (e.target.tagName.toLowerCase() === 'path') {
            const svg = $(e.target).parent().parent();
            const extension = $(svg).attr('extension');
            callExtension(extension);
        }
        else if (e.target.tagName.toLowerCase() === 'g') {
            const svg = $(e.target).parent();
            const extension = $(svg).attr('extension');
            callExtension(extension);
        }
        else if (e.target.tagName.toLowerCase() === 'svg') {
            const extension = $(e.target).attr('extension');
            callExtension(extension);
        }
    };

    // Makes the SVG phone icon grow and shrink on mouseover and mouseout respectively
    const svgMouseOverHandler = e => {
        const svg = e.target.tagName.toLowerCase() === 'svg' ? $(e.target) : $(e.target).parent().parent();
        $(svg).css('height', '30px');
        $(svg).css('width', '30px');
        $(svg).css('bottom', '1px');
        $(svg).css('fill', '#9900ff');
        $(svg).css('background', 'none');
    };

    const svgMouseOutHandler = e => {
        const svg = e.target.tagName.toLowerCase() === 'svg' ? $(e.target) : $(e.target).parent().parent();
        $(svg).css('height', '20px');
        $(svg).css('width', '20px');
        $(svg).css('bottom', '6px');
        $(svg).css('fill', 'white');
        $(svg).css('background', '#9900ff');
    };

    // Onclick function to handle highlighting the targeted name when a specific office is clicked
    const highlightName = el => {
        
        // Convert labelText into the assumed ID
        let labelText = el.getAttribute('labelText').toLowerCase().replaceAll(' ', '_');

        $('#search-bar').val(el.getAttribute('labelText'));
        $('#search-bar').trigger('keyup');

        // If the labelText isn't an empty string (unassigned or unknown office)
        // Then scroll into view and highlight on the clickable directory
        if (labelText !== '') {
            // const nameEl = document.getElementById(labelText);
            const personEl = document.querySelectorAll(`td[person=${labelText}]`)
            if (personEl) {
                personEl[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
                for (const index in personEl) {
                    personEl[index].style.transition = 'all 0.25s ease-in-out';
                    personEl[index].style.backgroundColor = 'yellow';
                    setTimeout(() => {
                        personEl[index].style.backgroundColor = 'white';
                    }, highlightTime);
                    setTimeout(() => {
                        personEl[index].style.transition = '';
                    }, highlightTime + 500);
                }
            }
        }
    }

    let clickedArea;

    // Onclick function to handle highlighting the targeted office when a name in the clickable
    // directory is clicked
    const highlightOffice = name => {

        // Switch the map to the office map
        handleMapSwitch(document.getElementById('office'));

        // Select the area
        let area;
        if (name.toLowerCase() === 'security')
            area = $(`area[labelText='${name}']`)[1];
        else
            area = $(`area[labelText='${name}']`);
        clickedArea = $(area);
        const scrollElement = $(area).parent().parent().attr('id');

        // Trigger the mouseover event and then trigger the mouseout event after 2 seconds
        // This highlights the map area
        setTimeout(() => {
            if (!clicked) {
                if(liveSpans !== [] && liveSpans) for (let i = 0; i < liveSpans.length; i++) liveSpans[i].remove();
                $(area).trigger('mouseover');
                clicked = true;
                $(area).mapster('set', false).mapster('set', true);
                document.getElementById(scrollElement).scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
            }
        }, 50)
        setTimeout(() => {
            clicked = false;
            $(area).trigger('mouseout');
            $(area).mapster('set', false);
            if(liveSpans !== [] && liveSpans) for (let i = 0; i < liveSpans.length; i++) liveSpans[i].remove();
            clickedArea = null;
        }, highlightTime + 50);
    }

    // Prints out the directory sheet
    const printDirectory = async () => {
        const printWindow = window.open(apiBaseUrl + '/api/print_directory');
    };

    // Opens calendar iframe and changes src attribute to calendar link
    const openCalendar = el => {
        const link = el.getAttribute('calendarLink');
        const iframe = document.getElementById('calendar-frame');
        iframe.setAttribute('src', link);

        const iframeCont = document.getElementById('calendar-container');
        iframeCont.style.height = '570px';
        iframeCont.style.border = '1px solid #e0e0e0';
        iframeCont.style.marginBottom = '20px';
        iframe.style.height = '525px';
        iframe.style.border = '1px solid #e0e0e0';
        setTimeout(() => {
            iframeCont.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
        }, 250);
    };

    // Closes calendar iframe
    const closeCalendar = () => {
        const iframe = document.getElementById('calendar-frame');
        const iframeCont = document.getElementById('calendar-container');
        iframeCont.style.height = '0';
        iframeCont.style.marginBottom = '0';
        iframe.style.height = '0';

        setTimeout(() => {
            iframeCont.style.border = 'none';
            iframe.style.border = 'none';
        }, 200);
    };

    /////////////////////////// END FUNCTIONALITY ///////////////////////////

    /////////////////////////// INITALIZATION ///////////////////////////
    let json; // Holds the response from the API so that it may be modified
              // later

    // Fetch the table from the API and render the department directory
    // Adds relavant event listeners
    const departmentDirInitialize = async () => {
        const response = await fetch(apiBaseUrl + '/api/by_department');
        json = await response.json();
        await renderDepartmentDirectory(json);
        $('td').click(directoryClickHandler);
        $('td svg').mouseover(svgMouseOverHandler);
        $('td svg').mouseout(svgMouseOutHandler);
    }

    // Function to initialize the page by rendering all the components and starting Mapster
    const initialize = async () => {

        // Add tag name function to JQuery
        jQuery.fn.tagName = () => {
            return this.prop('tagName');
        };

        // Run renderers
        // renderClickableDir();
        departmentDirInitialize();

        // Wait until assignOffices is finished to initialize mapster
        await assignOffices();

        // Add event listener to search bar
        // Works by testing if the current query is present in any of
        // name, extension, or department, if it is NOT then add a 'hidden'
        // property that the render function will use to determine whether
        // to render the person or not
        $('#search-bar').on('keyup', async function() {
            var value = $(this).val().toLowerCase();
            for (const dept in json) {
                for (const person in json[dept]) {
                    json[dept][person].hidden = Boolean(!(
                        person.toLowerCase().indexOf(value) > -1 ||
                        json[dept][person].extension.indexOf(value) > -1 ||
                        dept.toLowerCase().indexOf(value) > -1
                    ));
                }
            }
            $('#department-directory').html('');
            await renderDepartmentDirectory(json);
            $('td').click(directoryClickHandler);
            $('td svg').mouseover(svgMouseOverHandler);
            $('td svg').mouseout(svgMouseOutHandler);
        });

        // Written as a function to get updated values in mapster
        const getClickedArea = () => {
            return clickedArea;
        }
        
        // Initialize mapster
        $('img').mapster({
            mapKey: 'labelText',
            stroke: true,
            fillColor: '4e0082',
            strokeWidth: 3,
            strokeOpacity: 0.7,
            strokeColor: '9900ff',
            fillOpacity : 0.5,
            onMouseover: function(e) {
                if (!clicked) {
                    $(this).mapster('set',false).mapster('set',true);
                    drawLabel(this);
                }
                else if ($(this).attr('labelText') !== $(getClickedArea()).attr('labelText')){
                    $(this).mapster('set',false);
                }
            },
            onMouseout: function(e) { 
                if (!clicked) {
                    $(this).mapster('set',false);
                    if (liveSpans != [])
                        for (let i = 0; i < liveSpans.length; i++) liveSpans[i].remove();
                    liveSpans = [];
                }
            },
            onClick: function(e) {
                if(clicked) {
                    setTimeout(() => {
                        $(this).mapster('set', false);
                    }, 0.1)
                }
            }
        });
        setTimeout(() => {
            drawAllOnCanvas();
        }, 10);
    }

    // Run initialize on window load
    window.onload = initialize;

    /////////////////////////// END INITIALIZATION ///////////////////////////