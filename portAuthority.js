const http = require('http');
const parseString = require('xml2js').parseString;


module.exports = {
    process: function (req, res) {

        console.log(`got request for stop ${req.query.stopnr}`);

        let endpoint = 'http://truetime.portauthority.org/bustime/eta/getStopPredictionsETA.jsp?route=all&stop=Port%20Authority%20Bus:';
        let stopNr = req.query.stopnr;

        let url = endpoint + stopNr;

        if(!stopNr){
            let payload = {
                frames: [
                    {
                        "text": "Port Authority",
                        "icon": "a22948",
                        "index": 0
                    }
                ]
            };

            res.send(payload);
        }
        else {
            http.get(url, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    parseString(data, function (err, result) {
                        let stop = result.stop;

                        let index = 0;

                        let payload = {
                            frames: [
                                {
                                    "text": "Port Authority",
                                    "icon": "a22948",
                                    "index": index
                                }
                            ]
                        };

                        stop['pre'].forEach((elm) => {

                            index++;

                            let time = elm['pt'][0] === "&nbsp;" ? "" : elm['pt'][0],
                                units = elm['pu'][0],
                                bus = elm['rn'][0],
                                destination = elm['fd'][0],
                                fullLine = `#${bus} to ${destination}: ${time} ${units}`;

                            payload.frames.push({text: fullLine, index: index});

                        });

                        res.send(payload);

                    });

                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    }
};