document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitted');
    const inputField   = document.getElementById("tokenId");
    const url = 'https://services.itrmachines.com/sandbox/predict?tokenId=';

    inputField.focus();

    submitButton.addEventListener('click', async () => {
        var tokenId = document.getElementById('tokenId').value;
        let roundedPrice;
        try {
            const result = JSON.parse(await httpGetAsync(url + tokenId));
            roundedPrice = round(result.prices.predicted_price);
        } catch (error) {
            alert(`not enough data to evaluate land ${tokenId}`);
            return;
        }
        if(!document.getElementById("res")){
            var res = create_element("p", ["id", "res"]);
            res.innerText = `${tokenId}: ${roundedPrice} Eth`;
            document.body.insertBefore(res, submitButton);
        } else{
            document.getElementById("res").innerText = `${tokenId}: ${roundedPrice} Eth`;
        }
    })

    inputField.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("submitted").click();
            inputField.blur();
        }
    });

    function round(num, dec=2) {
        num *= 10**dec;
        num = Math.round(num);
        return num / 10**dec;
    }

    function httpGetAsync(url) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.send();
        });
    }

    function create_element(elem, pairs) {
        if (pairs.length % 2 !== 0) throw("length doesnt match");
        let element = document.createElement(elem);
        for (let i = 0; i < pairs.length; i++) {
            element.setAttribute(pairs[i], pairs[i+1]);
            i++;
        }
        return element;
    }
})