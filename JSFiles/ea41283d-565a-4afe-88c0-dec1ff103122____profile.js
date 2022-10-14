$(document).ready(function () {
    $('body').hide();
    $(window).on('load', function () {
        $('body').show();

        // get the vw & vh used in css, in js
        const vw = (coef) => window.innerWidth * (coef / 100);
        const vh = (coef) => window.innerHeight * (coef / 100);

        //Registering GSAP's plugins
        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrollToPlugin);

        //Initialize GSAP timeline
        const preloadAnim = gsap.timeline({ onComplete: hidePreloader });

        // Prepare text for animation by putting it in spans
        let titleArr = $('#rectangle h1').text().split("");
        let artNameArr = $('#artworkName').text().split("");
        let artistArr = $('#artist').text().split("");
        $('#rectangle h1').empty();
        $('#artworkName').empty();
        $('#artist').empty();
        titleArr.forEach(letter => {
            $('#rectangle h1').append("<span>" + letter + "</span>");
        });
        artNameArr.forEach(letter => {
            $('#artworkName').append("<span>" + letter + "</span>");
        });
        artistArr.forEach(letter => {
            $('#artist').append("<span>" + letter + "</span>");
        });

        // Create particle effect
        let particleNo = 70;
        let particleCounter = 0;

        while (particleCounter < particleNo) {
            let particle = $('<span class="particle">');
            let particleDimension = parseInt(Math.random() * 7 + 1).toString() + 'px';
            let blurDimension = parseFloat(Math.random() * 4).toString() + 'px';
            particle.css({
                'top': parseInt(Math.random() * 100 + 1).toString() + 'vh',
                'left': parseInt(Math.random() * 100 + 1).toString() + 'vw',
                'width': particleDimension,
                'height': particleDimension,
                'filter': 'blur(' + blurDimension + ')',
            });
            $('#preloader').append(particle);
            particleCounter++;
        }

        const particleAnim = gsap.to($('.particle'), {
            x: "random(-200, 200)",
            y: "random(-200, 200)",
            duration: 10,
            ease: Power1.easeInOut,
            repeat: -1,
            repeatRefresh: true,
        })
        const particleFlash = gsap.to($('.particle'), {
            autoAlpha: "random(0, 1)",
            ease: Power1.easeInOut,
            repeat: -1,
            duration: 2,
            repeatRefresh: true
        });


        // // // Animate pictures and rectangle
        let width = $(window).width();
        // Get updated width
        $(window).resize(function () {
            width = $(window).width();
            // Preloader resize 
            // Hide hands 
            if (width < 1100) {
                gsap.timeline().to($('#rightHand'), 0.5, {
                    autoAlpha: 0,
                    ease: 'power1.inOut'
                })
                    .to($('#leftHand'), 0.5, {
                        autoAlpha: 0,
                        ease: 'power1.inOut'
                    }, '-=.5')
            }
            // Hide art title & artist
            if (width < 1400) {
                gsap.timeline().to($('#artworkName'), 0.5, {
                    autoAlpha: 0,
                    ease: 'power1.inOut'
                })
                    .to($('#artist'), 0.5, {
                        autoAlpha: 0,
                        ease: 'power1.inOut'
                    }, '-=.5')
            }

            // Layouts resize
            resizeArtworks(width);
        });

        // // Change grid-template-columns and grid-template-areas depending on screen size
        function resizeArtworks(width) {
            if (width > 1650) {
                $('.layoutSettings').css('grid-template-columns', 'repeat(6, 1fr)');
                $('.patternI').css('grid-template-areas', '"A1 A1 A2 A2 A4 A6" "A1 A1 A3 A3 A5 A6"');
                $('.patternII').css('grid-template-areas', '"B1 B2 B4 B4 B6 B6" "B1 B3 B3 B5 B6 B6"');
                $('.patternIII').css('grid-template-areas', '"C1 C3 C4 C4 C5 C6" "C2 C3 C4 C4 C5 C7"');
            }
            else if (width <= 1650 && width > 1250) {
                $('.layoutSettings').css('grid-template-columns', 'repeat(5, 1fr)');
                $('.patternI').css('grid-template-areas', '"A1 A1 A2 A2 A6" "A1 A1 A5 A5 A6" "A3 A3 A4 A4 A4"');
                $('.patternII').css('grid-template-areas', '"B1 B2 B4 B4 B6" "B1 B3 B3 B5 B6"');
                $('.patternIII').css('grid-template-areas', '"C1 C1 C1 C2 C2" "C3 C3 C4 C5 C5" "C3 C3 C4 C5 C5" "C6 C6 C7 C7 C7"');
            } else if (width < 1250 && width > 900) {
                $('.layoutSettings').css('grid-template-columns', 'repeat(3, 1fr)');
                $('.patternI').css('grid-template-areas', '"A1 A1 A2" "A1 A1 A3" "A6 A4 A4" "A6 A5 A5"');
                $('.patternII').css('grid-template-areas', '"B1 B2 B2" "B1 B3 B3" "B4 B4 B6" "B5 B5 B6"');
                $('.patternIII').css('grid-template-areas', '"C1 C1 C7" "C2 C2 C3" "C4 C4 C3" "C4 C4 C5" "C6 C6 C5"');
            } else if (width <= 900) {
                $('.layoutSettings').css('grid-template-columns', 'repeat(1, 1fr)');
                $('.patternI').css('grid-template-areas', '"A1" "A1" "A2" "A3" "A4" " A5" "A6" "A6"');
                $('.patternII').css('grid-template-areas', '"B1" "B1" "B2" "B3" "B4" "B5" "B6" "B6"');
                $('.patternIII').css('grid-template-areas', '"C1" "C2" "C3" "C3" "C4" "C4" "C5" "C5" "C6" "C7"');
            }
        }

        if (width > 1100) {
            preloadAnim.fromTo($('#rightHand'), 2, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                ease: 'power1.inOut'
            })
                .to($('#rightHand'), 2, {
                    xPercent: 225,
                    scaleX: 2.5001,
                    scaleY: 2.5001,
                    fill: '#FFCE3B',
                    force3D: true,
                    rotationZ: 0.001,
                    ease: 'power1.inOut',
                })
                .fromTo($('#leftHand'), 2, {
                    autoAlpha: 0,
                }, {
                    autoAlpha: 1,
                    ease: 'power1.inOut'
                }, '-=4')
                .to($('#leftHand'), 2, {
                    xPercent: -195,
                    scaleX: 2.5001,
                    scaleY: 2.5001,
                    fill: '#FFCE3B',
                    force3D: true,
                    rotationZ: 0.001,
                    ease: 'power1.inOut',
                }, '-=2')
                .fromTo($('#left'), 1, {
                    height: vh(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    height: vh(70),
                    background: "rgb(23, 23, 23)"
                }, "-=2")
                .to($('#left'), 0, { css: { top: 0 } }, '-=1')
                .fromTo($('#top'), 1, {
                    width: vw(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    width: vw(75),
                    background: "rgb(23, 23, 23)"
                }, '-=1')
                .to($('#top'), 0, { css: { right: 0 } })
                .to($('#left'), 1, {
                    height: 0,
                    ease: "slow(0.7, 0.7, false)"
                }, '-=1')
                .to($('#left'), 0, { css: { autoAlpha: 0, } })
                .to($('#top'), 1, {
                    width: 0,
                    ease: "slow(0.7, 0.7, false)"
                })
                .to($('#top'), { css: { autoAlpha: 0, } })
                .fromTo($('#right'), 1, {
                    height: vh(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    height: vh(70),
                    background: "rgb(23, 23, 23)"
                }, '-=3.5')
                .to($('#right'), 0, { css: { bottom: 0 } }, '-=2.5')
                .to($('#right'), 1, {
                    height: 0,
                    ease: "slow(0.7, 0.7, false)"
                }, '-=2.5')
                .to($('#right'), { css: { autoAlpha: 0, } })
                .fromTo($('#bottom'), 1, {
                    width: vw(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    width: vw(75),
                    background: "rgb(23, 23, 23)"
                }, '-=3')
                .to($('#bottom'), 0, { css: { left: 0 } }, '-=2')
                .to($('#bottom'), 1, {
                    width: 0,
                    ease: "slow(0.7, 0.7, false)"
                }, '-=2')
                .to($('#bottom'), 0, { css: { autoAlpha: 0, } }, '-=1')
                .to($('#preloader h1').children('span'), 1, { // Animate title
                    top: 0,
                    opacity: 1,
                    ease: "power4.out",
                    stagger: 0.1
                }, '-=3')

        } else {
            // Don't animate hands
            preloadAnim.fromTo($('#left'), 1, {
                height: vh(0),
                background: "rgb(23, 23, 23)",
                ease: "slow(0.7, 0.7, false)"
            }, {
                height: vh(70),
                background: "rgb(23, 23, 23)"
            })
                .to($('#left'), 0, { css: { top: 0 } })
                .fromTo($('#top'), 1, {
                    width: vw(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    width: vw(75),
                    background: "rgb(23, 23, 23)"
                })
                .to($('#top'), 0, { css: { right: 0 } })
                .to($('#left'), 1, {
                    height: 0,
                    ease: "slow(0.7, 0.7, false)"
                }, '-=1')
                .to($('#left'), 0, { css: { autoAlpha: 0, } })
                .to($('#top'), 1, {
                    width: 0,
                    ease: "slow(0.7, 0.7, false)"
                })
                .to($('#top'), { css: { autoAlpha: 0, } })
                .fromTo($('#right'), 1, {
                    height: vh(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    height: vh(70),
                    background: "rgb(23, 23, 23)"
                }, '-=3.5')
                .to($('#right'), 0, { css: { bottom: 0 } }, '-=2.5')
                .to($('#right'), 1, {
                    height: 0,
                    ease: "slow(0.7, 0.7, false)"
                }, '-=2.5')
                .to($('#right'), { css: { autoAlpha: 0, } })
                .fromTo($('#bottom'), 1, {
                    width: vw(0),
                    background: "rgb(23, 23, 23)",
                    ease: "slow(0.7, 0.7, false)"
                }, {
                    width: vw(75),
                    background: "rgb(23, 23, 23)"
                }, '-=3')
                .to($('#bottom'), 0, { css: { left: 0 } }, '-=2')
                .to($('#bottom'), 1, {
                    width: 0,
                    ease: "slow(0.7, 0.7, false)"
                }, '-=2')
                .to($('#bottom'), 0, { css: { autoAlpha: 0, } }, '-=1')
                .to($('#preloader h1').children('span'), 1, { // Animate title
                    top: 0,
                    opacity: 1,
                    ease: "power4.out",
                    stagger: 0.1
                }, '-=3')
        }

        // Add artist and artworkname to the animation if above 1400
        if (width >= 1400) {
            preloadAnim
                .to($('#artworkName').children('span'), .1, { // Animate artwork name
                    top: 0,
                    opacity: 0.5,
                    ease: "power4.out",
                    stagger: 0.1
                }, '-=4')
                .to($('#artist').children('span'), .1, { // Animate artist
                    top: 0,
                    opacity: 0.5,
                    ease: "power4.out",
                    stagger: 0.1
                }, '-=4');
        }

        function hidePreloader() {
            const hidePreAnim = gsap.timeline({ onComplete: revealHomePage })
            hidePreAnim.to($('#preloader'), 1, {
                height: 0,
                ease: 'power3.int'
            })
                .to([$('#leftHand'), $('#rightHand'), $('#preloader h1')], 1, {
                    y: -vh(80),
                    ease: 'power3.int'
                }, '-=1');
        }
        // revealHomePage(); // DELETE THIS
        function revealHomePage() {
            // Remove particles from preloader
            $('.particle').remove();
            // Resize artworks before displaying 
            resizeArtworks(width);
            // Display page
            gsap.timeline().set([$('header'), $('main'), $('footer')], { css: { 'display': 'block' } })
                .to([$('header'), $('main'), $('footer')], 1, {
                    autoAlpha: 1,
                    ease: 'power1.intOut',
                    delay: .7
                });
        }

        // Get Harvard API data
        let page = 10;
        function getHarvardAPIData(artCount, element) {
            let baseURL = 'https://api.harvardartmuseums.org/object/';
            let queryString = $.param({
                apikey: '3091eed3-5864-44ee-b761-b6e28cd10be6',
                fields: 'primaryimageurl,title,description,caption,date',
                classification: 'Paintings',
                size: 1000
            });

            // Get request by artcount
            $.ajax({
                dataType: 'JSON',
                url: (baseURL + '?' + queryString + '&page=' + page.toString()),
                success: function (result) {
                    for (let x = 0; x < result.records.length; x++) {
                        let link = result.records[x].primaryimageurl;
                        let description = result.records[x].description;
                        let caption = result.records[x].caption;
                        let date = result.records[x].date;
                        if (link != null && description != null) {
                            let record = {
                                'link': link,
                                'description': description
                            };
                            // Add caption
                            if (caption != null) {
                                record['caption'] = caption;
                            } else {
                                record['caption'] = 'Unknown';
                            }
                            // Add date
                            if (date != null) {
                                record['date'] = date;
                            } else {
                                record['date'] = 'Unknown';
                            }

                            if (record.link.length > 0) {
                                // TODO Add details to extension
                                element.css({
                                    'background': 'url("' + record.link + '")',
                                    'background-size': 'cover'
                                })
                                break;
                            }

                        }
                    }
                }
            }); // end ajax request
            page++;
        }

        // Temporary array for poems
        let poems = [
            {
                "lines": [
                    "In pious times, ere priest-craft did begin,",
                    "Before polygamy was made a sin;",
                    "When man, on many, multipli'd his kind,",
                    "Ere one to one was cursedly confin'd:",
                    "When Nature prompted, and no Law deni'd",
                    "Promiscuous use of concubine and bride;",
                    "Then, Israel's monarch, after Heaven's own heart,",
                    "His vigorous warmth did variously impart",
                    "To wives and slaves: and, wide as his command,",
                    "Plots, true or false, are necessary things,",
                    "To raise up common-wealths, and ruin kings.",
                    "Salut au monde!",
                    "What cities the light or warmth penetrates, I penetrate those cities myself;",
                    "All islands to which birds wing their way, I wing my way myself.",
                    "",
                    "Toward all,",
                    "I raise high the perpendicular hand—I make the signal,",
                    "To remain after me in sight forever,",
                    "For all the haunts and homes of men."
                ]
            },
            {
                "lines": [
                    "My love is as a fever longing still,",
                    "For that which longer nurseth the disease;",
                    "Feeding on that which doth preserve the ill,",
                    "The uncertain sickly appetite to please.",
                    "My reason, the physician to my love,",
                    "Angry that his prescriptions are not kept,",
                    "Hath left me, and I desperate now approve",
                    "Desire is death, which physic did except.",
                    "Past cure I am, now Reason is past care,",
                    "And frantic-mad with evermore unrest;",
                    "My thoughts and my discourse as madmen's are,",
                    "At random from the truth vainly express'd;",
                    "  For I have sworn thee fair, and thought thee bright,",
                    "  Who art as black as hell, as dark as night."
                ]
            },
            {
                "lines": [
                    "IMMITATION OF ENGLISH POETS. WALLER",
                    "",
                    "'Come, gentle Air!' the Aeolian shepherd said,",
                    "While Procris panted in the secret shade;",
                    "'Come, gentle Air!' the fairer Delia cries,",
                    "While at her feet her swain expiring lies.",
                    "Lo! the glad gales o'er all her beauties stray,",
                    "Breathe on her lips, and in her bosom play!",
                    "In Delia's hand this toy is fatal found,",
                    "Nor could that fabled dart more surely wound:",
                    "Both gifts destructive to the givers prove;",
                    "Alike both lovers fall by those they love.",
                    "Yet guiltless too this bright destroyer lives,",
                    "At random wounds, nor knows the wound she gives:",
                    "She views the story with attentive eyes,",
                    "While Procris panted in the secret shade;",
                    "'Come, gentle Air!' the fairer Delia cries,",
                    "While at her feet her swain expiring lies.",
                    "Lo! the glad gales o'er all her beauties stray,",
                    "Breathe on her lips, and in her bosom play!",
                    "In Delia's hand this toy is fatal found,",
                    "Nor could that fabled dart more surely wound:",
                    "Both gifts destructive to the givers prove;",
                    "Alike both lovers fall by those they love.",
                    "Yet guiltless too this bright destroyer lives,",
                    "At random wounds, nor knows the wound she gives:",
                    "She views the story with attentive eyes,",
                    "And pities Procris, while her lover dies."
                ]
            },
            {
                "lines": [
                    "IMMITATION OF ENGLISH POETS. WALLER",
                    "",
                    "'Come, gentle Air!' the Aeolian shepherd said,",
                    "While Procris panted in the secret shade;",
                    "'Come, gentle Air!' the fairer Delia cries,",
                    "While at her feet her swain expiring lies.",
                    "Lo! the glad gales o'er all her beauties stray,",
                    "Breathe on her lips, and in her bosom play!",
                    "In Delia's hand this toy is fatal found,",
                    "Nor could that fabled dart more surely wound:",
                    "Both gifts destructive to the givers prove;",
                    "Alike both lovers fall by those they love.",
                    "Yet guiltless too this bright destroyer lives,",
                    "At random wounds, nor knows the wound she gives:",
                    "She views the story with attentive eyes,",
                    "And pities Procris, while her lover dies."
                ]
            },
            {
                "lines": [
                    "IMMITATION OF ENGLISH POETS. WALLER",
                    "",
                    "'Come, gentle Air!' the Aeolian shepherd said,",
                    "While Procris panted in the secret shade;",
                    "'Come, gentle Air!' the fairer Delia cries,",
                    "While at her feet her swain expiring lies.",
                    "Lo! the glad gales o'er all her beauties stray,",
                    "Breathe on her lips, and in her bosom play!",
                    "In Delia's hand this toy is fatal found,",
                    "Nor could that fabled dart more surely wound:",
                    "Both gifts destructive to the givers prove;",
                    "Alike both lovers fall by those they love.",
                    "Yet guiltless too this bright destroyer lives,",
                    "At random wounds, nor knows the wound she gives:",
                    "She views the story with attentive eyes,",
                    "And pities Procris, while her lover dies."
                ]
            },
            {
                "lines": [
                    "IMMITATION OF ENGLISH POETS. WALLER",
                    "",
                    "'Come, gentle Air!' the Aeolian shepherd said,",
                    "While Procris panted in the secret shade;",
                    "'Come, gentle Air!' the fairer Delia cries,",
                    "While at her feet her swain expiring lies.",
                    "Lo! the glad gales o'er all her beauties stray,",
                    "Breathe on her lips, and in her bosom play!",
                    "In Delia's hand this toy is fatal found,",
                    "Nor could that fabled dart more surely wound:",
                    "Both gifts destructive to the givers prove;",
                    "Alike both lovers fall by those they love.",
                    "Yet guiltless too this bright destroyer lives,",
                    "At random wounds, nor knows the wound she gives:",
                    "She views the story with attentive eyes,",
                    "And pities Procris, while her lover dies."
                ]
            },
            {
                "lines": [
                    "IN TWO DIALOGUES.",
                    "",
                    "DIALOGUE I.",
                    "",
                    "Sweet to the world, and grateful to the skies:",
                    "Truth guards the poet, sanctifies the line,",
                    "And makes immortal verse as mean as mine.",
                    "",
                    "Yes, the last pen for freedom let me draw,",
                    "When truth stands trembling on the edge of law;",
                    "Here, last of Britons! let your names be read;",
                    "Are none, none living? let me praise the dead,",
                    "And for that cause which made your fathers shine,",
                    "Fall by the votes of their degenerate line.",
                    "",
                    "_F_. Alas! alas! pray end what you began,",
                    "And write next winter more 'Essays on Man.'"
                ]
            }
        ]

        // Patterns specifications 
        const patterns = {
            'patternI': {
                'type': 'A',
                'amount': 6,
                'minHeight': [true, false, false, false, false, true],
                'poem': [false, true, false, false, false, true]
            },
            'patternII': {
                'type': 'B',
                'amount': 6,
                'minHeight': [true, false, false, false, false, true],
                'poem': [true, false, false, true, false, false]
            },
            'patternIII': {
                'type': 'C',
                'amount': 7,
                'minHeight': [false, false, true, true, true, false, false],
                'poem': [false, false, true, false, true, false]
            }
        };

        let totalArtworkCounter = 1;
        // Create rows by cycling the patterns dictionary 
        function createArtRows(amount, element) {

            let startPoint;
            while (amount > 0) {
                // Get the last pattern name or choose to start from the first one if none exist
                let lastPattern;
                try {
                    lastPattern = element.children('.layoutSettings').last().attr('class').split(' ')[1];
                } catch {
                    lastPattern = 'patternIII';
                }

                // Decide startPoint to avoid repeating the same pattern
                switch (lastPattern) {
                    case 'patternI': startPoint = 1; break;
                    case 'patternII': startPoint = 2; break;
                    case 'patternIII': startPoint = 0; break;
                }
                let patternName = Object.keys(patterns)[startPoint];
                let curentPattern = patterns[patternName];
                let rowArtCounter = 0;
                element.append('<div class="layoutSettings ' + patternName + '">');
                let currentRow = $('.layoutSettings').last();

                // Generate the each row depending on the current patern
                while (rowArtCounter < curentPattern.amount) {
                    let container = currentRow.append('<div class="container ' + curentPattern.type + (rowArtCounter + 1).toString() + '">');
                    $('.container').last().append('<div class="artwork" id="art-' + totalArtworkCounter.toString() + '">');

                    // Insert poem or artwork depending on the design
                    if (curentPattern.poem[rowArtCounter]) {
                        let currentPoem = poems[rowArtCounter].lines;
                        $('#art-' + totalArtworkCounter.toString()).append('<h1>Poem title</h1>');
                        $('#art-' + totalArtworkCounter.toString()).append('<div class="poemLines">')
                        currentPoem.forEach(function (line) {
                            $('.poemLines').append('<p>' + line + '</p>');
                        })
                    } else {
                        // Call getHarvardAPIData to assign the artwork link
                        getHarvardAPIData(1, $('#art-' + totalArtworkCounter.toString()));

                    }
                    // Add min-height if required
                    if (curentPattern.minHeight[rowArtCounter]) {
                        $('#art-' + totalArtworkCounter.toString()).css('min-height', '61vh');
                    }
                    totalArtworkCounter++;
                    rowArtCounter++;
                }
                amount--;
            }
        }
        function createProfile(name, picture, info) {
            $("#profileDetails").append(`<div id="profilePicNameLike"></div>`);
            $("#profileDetails").append(`<div id="profileInfo"><p> ${info} </p></div>`);
            $("#profilePicNameLike").append(`<div id="profilePicture"><img src="${picture}" alt=""></div>`);
            $("#profilePicNameLike").append(`<div id="profileColumn"></div>`);
            $("#profileColumn").append(`<div id="profileName"><p> ${name} </p></div>`);
            // $("#profileColumn").append(`<div id="profileLiked"><img src="images/love.png" alt=""></div>`);
        }

        function removeProfile() {
            $('.layoutSettings').remove() + $("#profilePicNameLike").remove() + $("#profileInfo").remove();
        }
        // function createFollowers(){
        //     $("#followersDetails").append('<div id="followersPicNameLike"></div>');
        //     $("#followersDetails").append('<div id="followersInfo"><p>gjeigjeigjeigegegeg</p></div>');
        //     $("#followersPicNameLike").append('<div id="followersPicture"><img src="images/avatar.jpg" alt=""></div>');
        //     $("#followersPicNameLike").append('<div id="followersColumn"></div>');
        //     $("#followersColumn").append('<div id="followersName"><p>askgjasdgkjasdlkgjasdklf</p></div>');
        //     $("#followersColumn").append('<div id="followersLiked"><img src="images/heart.jpg" alt=""></div>')
        // }
        // function removeFollowers(){
        //      $("#followersDetails div").remove();
        // }
        var buttonClicked = true;


        function animationLoad() {
            // Function that adds hover functionality to an icon
            function hoverIcon(icon) {
                icon.hover(function () {
                    gsap.to(icon, .3, {
                        color: '#CEA65B',
                        ease: 'power1.inOut'
                    });
                }, function () {
                    gsap.to(icon, .3, {
                        color: '#CACACA',
                        ease: 'power1.inOut'
                    });
                });
            }

            // Animate if hover
            let hoverAnim = gsap.timeline();
            let expansionAnim = gsap.timeline();
            let leaveArtAnim = gsap.timeline();

            $('.container').hover(function () {
                console.log("Hover");
                if (!artIsClicked) {
                    $(this).append('<div class="containerHover">');
                    $('.containerHover').append('<span class="topBorder">')
                        .append('<span class="rightBorder">')
                        .append('<span class="bottomBorder">')
                        .append('<span class="leftBorder">');

                    // Animate border
                    hoverAnim.fromTo($('.leftBorder'), 0.5, {
                        autoAlpha: 0
                    }, {
                        autoAlpha: 1,
                        height: $(this).height()
                    })
                        .fromTo($('.topBorder'), 0.5, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1,
                            width: $(this).width() * 0.99
                        })
                        .fromTo($('.rightBorder'), 0.5, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1,
                            height: $(this).height()
                        }, '-=1')
                        .fromTo($('.bottomBorder'), 0.5, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1,
                            width: $(this).width()
                        }, '-=0.5')
                        // Reverse border
                        .to($('.leftBorder'), 0.5, {
                            y: -$(this).height() + 1,
                            height: 0
                        }, '-=0.5')
                        .to($('.leftBorder'), {
                            borderTop: 0,
                            borderBottom: 0
                        }, '-=0.5')
                        .to($('.leftBorder'), {
                            autoAlpha: 0
                        })
                        .to($('.topBorder'), 0.5, {
                            x: $(this).width() - 1,
                            width: 0,
                        }, '-=.5')
                        .to($('.topBorder'), {
                            borderLeft: 0,
                            borderRight: 0
                        }, '-=0.5')
                        .to($('.topBorder'), {
                            autoAlpha: 0
                        }, '-=.0')
                        .to($('.rightBorder'), 0.5, {
                            y: $(this).height() - 1,
                            height: 0
                        }, '-=1.5')
                        .to($('.rightBorder'), {
                            borderTop: 0,
                            borderBottom: 0
                        }, '-=1.5')
                        .to($('.rightBorder'), {
                            autoAlpha: 0
                        }, '-=0.5')
                        .to($('.bottomBorder'), 0.5, {
                            x: -$(this).width(),
                            width: 0,
                        }, '-=1')
                        .to($('.bottomBorder'), {
                            borderLeft: 0,
                            borderRight: 0
                        }, '-=1')
                        .to($('.bottomBorder'), {
                            autoAlpha: 0
                        }, '-=.0');
                }

                // Display icons
                $('.containerHover').append('<i class="fas fa-heart fa-2x"></i>');
                $('.containerHover').append('<i class="fas fa-plus fa-2x"></i>');
                $('.containerHover').append('<i class="fas fa-share fa-2x"></i>');

                // TODO I think it should animate only if elements are not null, as this will check if they are removed or not.

                hoverAnim.fromTo($('.containerHover'), 0.7, {
                    background: ""
                }, {
                    ease: 'power1.inOut',
                    background: "linear-gradient(0deg, rgba(40,40,40,1) 0%, rgba(40,40,40,.7) 14%, rgba(255,255,255,0) 55%)"
                }, '-=1.75')
                    .to($('.fa-heart, .fa-plus, .fa-share'), 0.7, {
                        ease: 'power1.inOut',
                        opacity: 1
                    }, '-=1.3');

                // Adding hover functionality to the icons
                hoverIcon($('.fa-heart'));
                hoverIcon($('.fa-plus'));
                hoverIcon($('.fa-share'));

                // Heart clicked
                $('.fa-heart').click(function () {
                    gsap.to(this, {
                        color: '#C64939',
                    })
                });

            }, outContainer);

            // Rearrange icons if they're displayed when user clicks artwork
            function outContainer() {
                hoverAnim.progress(1);
                // Reposition icons if artwork expands
                if (artIsClicked) {
                    $('.containerHover').remove();
                } else {
                    $('.containerHover').remove();
                    $('.fa-heart, .fa-plus, .fa-share', '.containerHover').remove();
                }
            }


            // Animate if clicking
            let artIsClicked = false;
            let restoreArt = false;
            $('.container').click(function (event) {
                // Prevent multiple clicks and check if icons are clicked
                if (!artIsClicked && !$(event.target).is('i')) {
                    artIsClicked = true;
                    // Fast forward border anim if running and clear icons if present
                    if (hoverAnim.isActive() || $('.containerHover').children('.fas')) {
                        console.log("Cleared!");
                        outContainer();
                    }

                    // Blur all the other containers
                    $('.container').css({
                        'filter': 'blur(5px)',
                        'z-index': -100
                    })
                    $(this).css({
                        'filter': 'blur(0px)',
                        'z-index': 1
                    })
                    // Rescale the artwork by modifying the templetate-areas
                    let currentHeight = $(this).height();
                    let currentWidth = $(this).width();

                    // Update current values if window gets resized
                    $(window).resize(() => {
                        currentHeight = $(this).height();
                        currentWidth = $(this).width();
                    });

                    // Set the container's style before animating
                    setStyleProperties($(this));

                    let resizeArtAnim = gsap.timeline({ onComplete: animateExtension, onCompleteParams: [$(this)] });

                    // Choose how much to expand the artwork depending on the no of columns 
                    let currentColumnsNo = $(this).parent().css('grid-template-columns').split(' ').length;
                    let widthOfArt;
                    switch (currentColumnsNo) {
                        case 6: widthOfArt = vw(55); break;
                        case 5: widthOfArt = vw(55); break;
                        case 3: widthOfArt = vw(80); break;
                        case 1: widthOfArt = $(this).width(); break;
                    }

                    $(this).append('<div class="extension">');
                    resizeArtAnim.fromTo($(this), 1, {
                        height: currentHeight,
                    }, {
                        width: widthOfArt, // change depending on layout 
                        height: vh(61),
                        ease: 'power1.inOut'
                    })
                        .fromTo($('.artwork', this), 1, {
                            height: currentHeight,
                            width: '100%'
                        }, {
                            height: vh(61),
                            ease: 'power1.inOut'
                        }, '-=1');


                    // Get the aspect ration of cover/contain in pixel to be able to animate the transition
                    function getImageSize(image, size) {
                        // Create new image object and set the url
                        let url = image.css('background-image').replace(/^(url\(\")/g, "").replace(/\"\)$/, "");
                        let newImage = new Image();
                        newImage.setAttribute('src', url);

                        // Get dimensions for image and parent
                        let parentHeight = image.parent().height();
                        let parentWidth = image.parent().width();
                        let height = newImage.naturalHeight;
                        let width = newImage.naturalWidth;

                        // Initialize future height and width variable
                        let newHeight;
                        let newWidth;

                        // Set height and width depending on size parameter
                        if (size == 'contain') {
                            if (height > width) {
                                newHeight = parentHeight;
                                newWidth = (parentHeight * width) / height;
                            } else { // width > height
                                newHeight = (parentWidth * height) / width;
                                newWidth = parentWidth;
                                if (newHeight > parentHeight) {
                                    let ratio = height / width;
                                    newHeight = parentHeight;
                                    newWidth = parentHeight / ratio;
                                }
                            }
                        } else if (size == "cover") {
                            newWidth = parentWidth;
                            newHeight = parentHeight;
                        }

                        let newSize = [Math.ceil(newWidth) + "px", Math.ceil(newHeight) + "px"];
                        return newSize;
                    }

                    function animateExtension(element) {
                        // Prevent animating the extension if leaveArtAnim is running
                        if (!leaveArtAnim.isActive()) {

                            let metRequest;
                            $.ajax({
                                dataType: 'JSON', url: ('MET request.json'), success: (json) => {
                                    metRequest = json;
                                    addExtensionDetails();
                                }
                            });

                            function addExtensionDetails() {
                                console.log("Adding to extension");

                                // Add text to the extension 
                                $('.extension').append('<div class="artText">');

                                // Create and populate elements
                                let title = $('<p class="titleArt"></p>').text(metRequest.title);
                                let description = $('<p class="descriptionArt"></p>').text('Description: ');
                                let creationDate = $('<p class="descriptionArt"></p>').text('Creation date: ' + metRequest.objectDate);
                                let culture = $('<p class="descriptionArt"></p>').text('Culture: ' + metRequest.culture);
                                let creditLine = $('<p class="descriptionArt"></p>').text('Credit line: ' + metRequest.creditLine);
                                let medium = $('<p class="descriptionArt"></p>').text('Medium: ' + metRequest.medium);

                                // Append all elements to extension
                                $('.artText').append(title, description, creationDate, culture, medium, creditLine);

                                // Add icons to extension
                                $('.extension').append('<i class="fas fa-heart fa-2x"></i>');
                                $('.extension').append('<i class="fas fa-plus fa-2x"></i>');
                                $('.extension').append('<i class="fas fa-share fa-2x"></i>');

                                // Adding hover functionality to the icons
                                hoverIcon($('.fa-heart'));
                                hoverIcon($('.fa-plus'));
                                hoverIcon($('.fa-share'));

                                $('.extension', element).css({
                                    'width': element.width(),
                                    'background-color': '#131313'
                                })
                                $('.artwork', element).css('overflow-y', 'auto');


                                // Animate to size "cover" only if it's not a poem
                                if ($('.artwork', element).children('p').length == 0) {
                                    let coverSize = getImageSize($('.artwork', element), "cover");
                                    let containSize = getImageSize($('.artwork', element), "contain");

                                    expansionAnim.to($('.extension'), 1, {
                                        height: vh(50),
                                        y: vh(50),
                                        ease: 'power1.inOut'
                                    })
                                        .fromTo($('.artwork', element), 0.5, {
                                            width: coverSize[0],
                                            height: coverSize[1],
                                            ease: 'power1.inOut',
                                        }, {
                                            width: containSize[0],
                                            height: containSize[1],
                                            ease: 'power1.inOut',
                                        }, '-=1')
                                }
                                expansionAnim.fromTo($('.titleArt, .descriptionArt'), .5, {
                                    autoAlpha: 0,
                                    display: 'none'
                                }, {
                                    autoAlpha: 1,
                                    display: 'block',
                                    ease: 'power1.inOut'
                                })
                                    .fromTo($('.fa-heart, .fa-plus, .fa-share'), .5, {
                                        autoAlpha: 0,
                                    }, {
                                        autoAlpha: 1,
                                        ease: 'power1.inOut'
                                    }, '-=.5')
                            }
                        }

                    }

                    // Restore artwork to its original position
                    $(this).mouseleave(function () {
                        // Don't run sequence if the artwork is clicked or if the .mouseleave sequence is already running
                        if (artIsClicked && !restoreArt) {
                            restoreArt = true;
                            leaveArtAnim = gsap.timeline({ onComplete: revertContainerChanges, onCompleteParams: [$(this)] });

                            leaveArtAnim
                                .to($('.extension'), 0.5, {
                                    height: 0,
                                    y: 0,
                                    ease: 'power1.inOut'
                                })
                                .to($('.extension').children(), 0.5, {
                                    autoAlpha: 0
                                }, '-=.5')
                                .call(() => $('.artText').remove())

                                // Stop extension from displaying as the artwork is resized
                                .to($('.extension'), 0, {
                                    css: {
                                        'height': 0,
                                        'width': 0
                                    }
                                })

                            // Resize artwork
                            // Add background size if painting, otherwise scroll poem to the top
                            if ($(this).find('.poemLines').length == 0) {
                                leaveArtAnim.to($('.artwork', this), 0, { backgroundSize: 'cover' })
                            } else {
                                leaveArtAnim.to($('.artwork', this), 0.5, { scrollTop: 0, ease: 'power1.inOut' })
                            }
                            leaveArtAnim.to($('.artwork', this), 1, {
                                height: vh(30),
                                width: '100%',
                                ease: 'power1.inOut'
                            })
                                .to($(this), 1, {
                                    height: currentHeight,
                                    width: currentWidth,
                                    ease: 'power1.inOut'
                                }, '-=1')
                        }

                    });

                    function revertContainerChanges(container) {
                        let currentBackground = $('.artwork', container).css('background');
                        let artworkPosition = $(container).attr('class').split(' ')[1];
                        let artworkNumber = artworkPosition.split('')[1];
                        let artworkType = artworkPosition.split('')[0];
                        let artworkMinHeight;
                        let isPoem;

                        // Find the the position of the artwork and check if it needs a minimum height
                        $.each(patterns, function (key, value) {
                            if (value.type == artworkType) {
                                isPoem = value.poem[artworkNumber - 1];
                                artworkMinHeight = value.minHeight[artworkNumber - 1];
                            }
                        });

                        // Remove blur from the other containers
                        $('.container').css({
                            'filter': 'blur(0px)',
                            'z-index': 1
                        })
                        $('.extension').remove();

                        // Restore style properties
                        container.removeAttr('style');
                        $('.artwork', container).removeAttr('style');
                        $('.arwtork', container).css({
                            'height': '30vh',
                            'width': '100%',
                        });

                        if (!isPoem) {
                            $('#' + container.children().attr('id')).css({
                                'background': currentBackground,
                            })
                        }

                        // Assign minimum height if required
                        if (artworkMinHeight) {
                            $('#' + container.children().attr('id')).css({
                                'min-height': '61vh',
                            })
                        }
                        restoreArt = false;
                        artIsClicked = false;
                    }
                }

            });

            // Set unique css properties for each artwork, making it position:absolute
            function setStyleProperties(container) {

                // Get coordinates of parent and container data 
                let parent = container.parent();
                let parentTop = parent.offset().top;
                let parentLeft = parent.offset().left;
                let parentRight = parentLeft + parent.width();
                let parentMidV = parent.width() / 2;
                let height = container.height();
                let width = container.width();
                let top = $(container).position().top;
                let left = $(container).position().left;
                let right = left + width;

                // Absolute values relative to the screen
                let absoluteBot = $(window).height() - top - height;
                let absoluteRight = $(window).width() - left - width;

                // Creating the css data 
                let cssTopLeft = { top: top, left: left, position: 'absolute' };
                let cssBotLeft = { bottom: absoluteBot, left: left, position: 'absolute' };
                let cssTopRight = { top: top, right: absoluteRight, position: 'absolute' };
                let cssBotRight = { bottom: absoluteBot, right: absoluteRight, position: 'absolute' };
                let cssZero = { top: 0, left: 0, position: 'relative' };

                // Apply generic css properties
                container.css({ height: height, width: width });

                // Apply specific css properties
                if (parseInt(left) == parseInt(parentLeft) && parseInt(right) == parseInt(parentRight)) {
                    container.css(cssZero);
                } else if (parseInt(top) == parseInt(parentTop)) {
                    if (left > parentMidV || parseInt(right) == parseInt(parentRight)) {
                        container.css(cssTopRight);
                    } else {
                        container.css(cssTopLeft);
                    }
                } else {
                    if (left > parentMidV || parseInt(right) == parseInt(parentRight)) {
                        container.css(cssBotRight);
                    } else {
                        container.css(cssBotLeft);
                    }
                }


            }
        }
        var defaultState = true;

        if (defaultState == true) {
            defaultState = false;
            buttonClicked = false;
            createArtRows(10, $('main'));
            createProfile(loggedInUser.profileName, loggedInUser.profileAvatar, loggedInUser.description);
            buttonClicked = false;
            animationLoad();
        }

        $("#toggle-on").click(function () {
            if (buttonClicked === false) { }
            else {
                hideFollowed();
                createArtRows(10, $('main'));
                createProfile(loggedInUser.profileName, loggedInUser.profileAvatar, loggedInUser.description);
                // removeFollowers();
                buttonClicked = false;
                animationLoad();
            }




            // Generate amount of rows

        })

        $("#toggle-off").click(function () {
            if (buttonClicked === true) { }
            else {
                // createFollowers(); 
                removeProfile();
                buttonClicked = true;

                //////////////////////// Piotr's:
                generatePlaceholders();
                generateFollowed();
                displayFollowed();
                showMoreEvent();
            }
        })
    }); // end page is loaded
}); // end of js