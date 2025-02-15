var alertShown = false;

function login(manualLogin = false) {

    var password = "";

    try {

        if (manualLogin) {
            password = document.getElementById("password").value || "";
            localStorage.setItem("password", password);
            decryptAndRender(password);
            return;
        }

        else {

            //check if password is in query string
            password = getParameterByName("password");
            if (password) {
                localStorage.setItem("password", password);
                decryptAndRender(password);
                return;
            }

            //check if password is already in storage
            password = localStorage.getItem("password");
            if (password) {
                decryptAndRender(password);
                return;
            }

        }

    } catch (error) {
        //clear session storage on error.
        localStorage.removeItem("password");
        if (error) {
            if (error.message == "ccm: tag doesn't match") {
                showAlert("Password incorrect");
            } else if (error.message) {
                showAlert(error.message);
            } else {
                showAlert("Something went wrong.");
            }
        }
    }

}

function decryptAndRender(password) {
    var decryptedHtmlPage = sjcl.decrypt(password, encryptedHtml);
    document.open("text/html", "replace");
    document.write(decryptedHtmlPage);
    document.close();
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function showAlert(message) {
    var container = document.getElementById("alert");
    if (container) {
        container.outerHTML = `<p id="alert" class="alert" onClick="dismissAlert()"><a href="#" onClick="dismissAlert()">[x]</a>&nbsp;&nbsp;${message}</p>`;
        alertShown = true;
    }
}

function dismissAlert() {
    var container = document.getElementById("alert");
    if (container) {
        container.outerHTML = `<p id="alert"></p>`;
        alertShown = false;
    }
}

function passwordKeyPress(event) {
    if (alertShown) {
        dismissAlert();
    }
    if (event.key == "Enter") {
        login(true);
    }
}