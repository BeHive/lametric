const https = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
    process: function (req, res) {

        https.get('https://www.metrolisboa.pt/wp-admin/admin-ajax.php?action=estado_linhas_mobile_ajax_action', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let content = new JSDOM(data);
                let linhas = content.window.document.querySelectorAll("h5");
                let payload = {
                    frames: [
                        {
                            "text": "Metro",
                            "icon": "i22347",
                            "index": 0
                        }
                    ]
                };

                linhas.forEach((elm) => {
                    let linha = elm.querySelector(".nomeLinhaMobile").innerHTML.split(" ")[1];
                    let icon, index;
                    switch (linha) {
                        case 'Amarela':
                            icon = "i22348";
                            index = 1;
                            break;
                        case 'Verde':
                            icon = "i22350";
                            index = 2;
                            break;
                        case 'Azul':
                            icon = "i22349";
                            index = 3;
                            break;
                        case 'Vermelha':
                            icon = "i22351";
                            index = 4;
                            break;
                    }
                    let estado = elm.querySelector(".circ_mobile").innerHTML;
                    estado = estado.split(" ");
                    estado = estado[estado.length - 1];

                    payload.frames.push({text: estado, icon: icon, index: index});
                });

                res.send(payload);

            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    }

};