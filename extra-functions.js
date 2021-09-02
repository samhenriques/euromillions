





/////////////////////////   HTTP REQUESTS     ////////////


/// LOAD JSON
function loadJSON(callback) {

    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {

            if (req.status === 200) {
                // Here the callback gets implemented
                let json = JSON.parse(req.responseText);

                if (req.status == 200) {
                    console.log(`Json Parsed, server say ${req.status}`)
                } else {
                    console.log(`${req.status}`)
                }

                ///  CALL BACK
                callback(json);
            } else {

            }
        }
    };

    req.open("GET", "https://api.jsonbin.io/b/612a6b86c5159b35ae0596d9/latest", true);
    req.setRequestHeader("secret-key", "$2b$10$SUWnPQUm5ViA5p9ASJ4bvefmiINTZCr1oghWTwmrEz17yun41HP7O");
    req.setRequestHeader("Content-Type", "application/json");
    req.send();
}



/// UPDATE JSON
function updateDatabase(newJson, newIdNUmber_job) {

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            /* console.log(req.responseText); */
            /*  console.log(`Request sent to delete id ${idNumber}`) */

            if (req.status == 200) {
                console.log(`Element with id number ${newIdNUmber_job}, server say ${req.status}`)
            } else {
                console.log(`${req.status}`)
            }

            if (!window.location.href.endsWith('index.html')) {
                window.location.href = 'index.html';
            }
        }
    };

    req.open("PUT", "https://api.jsonbin.io/b/612a6b86c5159b35ae0596d9", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("secret-key", "$2b$10$SUWnPQUm5ViA5p9ASJ4bvefmiINTZCr1oghWTwmrEz17yun41HP7O");
    req.setRequestHeader("versioning", false);
    req.send(JSON.stringify(newJson));
}


//  DELETE JOB
function deleteJsonEntry(idNumber) {


    if (!confirm('Are you sure you want to delete this record?\nThis record will be gore forever!')) {
        throw 0
    }


    function deleteEntry(obj, idNumber) {
        obj.filter((x, i) => {
            if (x.id === idNumber) {
                obj.splice(i, 1)
            }
        })
    }

    function deleteHtmlElement(elementId) {
        const element = document.getElementById(elementId)
        const parent = element.parentElement.remove()
    }

    loadJSON(function getJsonFromServer(json) {

        deleteEntry(json, idNumber)

        updateDatabase(json, `${idNumber} Deleted`)

        //  delete HTML element
        try {
            deleteHtmlElement(idNumber)
        } catch (e) { }
    });
}





/* Replace Special Characters/Accents V3 */

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function cleanUpSpecialChars(str) {
    return str

        .replace(/[AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄ]/g, 'A')
        .replace(/[Ꜳ]/g, 'AA')
        .replace(/[ÆǼǢ]/g, 'AE')
        .replace(/[Ꜵ]/g, 'AO')
        .replace(/[Ꜷ]/g, 'AU')
        .replace(/[ꜸꜺ]/g, 'AV')
        .replace(/[Ꜽ]/g, 'AY')
        .replace(/[BⒷＢḂḄḆɃƂƁ]/g, 'B')
        .replace(/[CⒸＣĆĈĊČÇḈƇȻꜾ]/g, 'C')
        .replace(/[DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ]/g, 'D')
        .replace(/[ǱǄ]/g, 'DZ')
        .replace(/[ǲǅ]/g, 'Dz')
        .replace(/[EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ]/g, 'E')
        .replace(/[FⒻＦḞƑꝻ]/g, 'F')
        .replace(/[GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ]/g, 'G')
        .replace(/[HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ]/g, 'H')
        .replace(/[IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ]/g, 'I')
        .replace(/[JⒿＪĴɈ]/g, 'J')
        .replace(/[KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ]/g, 'K')
        .replace(/[LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ]/g, 'L')
        .replace(/[Ǉ]/g, 'LJ')
        .replace(/[ǈ]/g, 'Lj')
        .replace(/[MⓂＭḾṀṂⱮƜ]/g, 'M')
        .replace(/[NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ]/g, 'N')
        .replace(/[Ǌ]/g, 'NJ')
        .replace(/[ǋ]/g, 'Nj')
        .replace(/[OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ]/g, 'O')
        .replace(/[Ƣ]/g, 'OI')
        .replace(/[Ꝏ]/g, 'OO')
        .replace(/[Ȣ]/g, 'OU')
        .replace(/[PⓅＰṔṖƤⱣꝐꝒꝔ]/g, 'P')
        .replace(/[QⓆＱꝖꝘɊ]/g, 'Q')
        .replace(/[RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ]/g, 'R')
        .replace(/[SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ]/g, 'S')
        .replace(/[TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ]/g, 'T')
        .replace(/[Ꜩ]/g, 'TZ')
        .replace(/[UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ]/g, 'U')
        .replace(/[VⓋＶṼṾƲꝞɅ]/g, 'V')
        .replace(/[Ꝡ]/g, 'VY')
        .replace(/[WⓌＷẀẂŴẆẄẈⱲ]/g, 'W')
        .replace(/[XⓍＸẊẌ]/g, 'X')
        .replace(/[YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ]/g, 'Y')
        .replace(/[ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ]/g, 'Z')
        .replace(/[aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/g, 'a')
        .replace(/[ꜳ]/g, 'aa')
        .replace(/[æǽǣ]/g, 'ae')
        .replace(/[ꜵ]/g, 'ao')
        .replace(/[ꜷ]/g, 'au')
        .replace(/[ꜹꜻ]/g, 'av')
        .replace(/[ꜽ]/g, 'ay')
        .replace(/[bⓑｂḃḅḇƀƃɓ]/g, 'b')
        .replace(/[cⓒｃćĉċčçḉƈȼꜿↄ]/g, 'c')
        .replace(/[dⓓｄḋďḍḑḓḏđƌɖɗꝺ]/g, 'd')
        .replace(/[ǳǆ]/g, 'dz')
        .replace(/[eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/g, 'e')
        .replace(/[fⓕｆḟƒꝼ]/g, 'f')
        .replace(/[gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/g, 'g')
        .replace(/[hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/g, 'h')
        .replace(/[ƕ]/g, 'hv')
        .replace(/[iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı]/g, 'i')
        .replace(/[jⓙｊĵǰɉ]/g, 'j')
        .replace(/[kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/g, 'k')
        .replace(/[lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ]/g, 'l')
        .replace(/[ǉ]/g, 'lj')
        .replace(/[mⓜｍḿṁṃɱɯ]/g, 'm')
        .replace(/[nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/g, 'n')
        .replace(/[ǌ]/g, 'nj')
        .replace(/[oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ]/g, 'o')
        .replace(/[ƣ]/g, 'oi')
        .replace(/[ȣ]/g, 'ou')
        .replace(/[ꝏ]/g, 'oo')
        .replace(/[pⓟｐṕṗƥᵽꝑꝓꝕ]/g, 'p')
        .replace(/[qⓠｑɋꝗꝙ]/g, 'q')
        .replace(/[rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/g, 'r')
        .replace(/[sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ]/g, 's')
        .replace(/[tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/g, 't')
        .replace(/[ꜩ]/g, 'tz')
        .replace(/[uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/g, 'u')
        .replace(/[vⓥｖṽṿʋꝟʌ]/g, 'v')
        .replace(/[ꝡ]/g, 'vy')
        .replace(/[wⓦｗẁẃŵẇẅẘẉⱳ]/g, 'w')
        .replace(/[xⓧｘẋẍ]/g, 'x')
        .replace(/[yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/g, 'y')
        .replace(/[zⓩｚźẑżžẓẕƶȥɀⱬꝣ]/g, 'z')
        .replace(/[.,]/g, ' ')
        .replace(/['`´]/g, ' ')
        .replace(/[^a-z0-9-._/   ]/gi, ''); // final clean up
}


/*  END OF -----   Replace Special Characters/Accents V3 */

















// function deleteJsonEntry(idNumber) {


//     if (!confirm('Are you sure you want to delete this record?\nThis record will be gore forever!')) {
//         throw 0
//     }


//     function deleteHtmlElement(elementId) {
//         const element = document.getElementById(elementId)
//         const parent = element.parentElement.remove()
//     }


//     function updateDatabase(newJson) {

//         let req = new XMLHttpRequest();

//         req.onreadystatechange = () => {
//             if (req.readyState == XMLHttpRequest.DONE) {
//                 /* console.log(req.responseText); */
//                 /*  console.log(`Request sent to delete id ${idNumber}`) */
//                 console.log(`Element with id number ${idNumber} deleted, server say ${req.status}`)
//             }
//         };

//         req.open("PUT", "https://api.jsonbin.io/b/612a6b86c5159b35ae0596d9", true);
//         req.setRequestHeader("Content-Type", "application/json");
//         req.setRequestHeader("secret-key", "$2b$10$SUWnPQUm5ViA5p9ASJ4bvefmiINTZCr1oghWTwmrEz17yun41HP7O");
//         req.setRequestHeader("versioning", false);
//         req.send(JSON.stringify(newJson));
//     }



//     //  New json request
//     let req = new XMLHttpRequest();
//     req.onreadystatechange = () => {
//         if (req.readyState == XMLHttpRequest.DONE) {

//             let json = JSON.parse(req.responseText);



//             deleteEntry(json, idNumber)


//             updateDatabase(json)
//             console.log(`Json Parsed, server say ${req.status}`)

//             //  delete HTML element
//             try {
//                 deleteHtmlElement(idNumber)
//             } catch (e) { }

//         }
//     };

//     req.open("GET", "https://api.jsonbin.io/b/612a6b86c5159b35ae0596d9", true);
//     req.setRequestHeader("secret-key", "$2b$10$SUWnPQUm5ViA5p9ASJ4bvefmiINTZCr1oghWTwmrEz17yun41HP7O");
//     req.send();


// }