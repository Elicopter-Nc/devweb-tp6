const originURL = "http://localhost:8080/";


async function updateCount() {
    const res = await fetch(originURL + "api-v2/", { headers: { Accept: "application/json" } });
    const data = await res.json();
    document.getElementById("count").textContent = `Il y a ${data.count} liens`;
}

async function updateHistory() {
    const res = await fetch(originURL + "api-v2/history", { headers: { Accept: "application/json" } });
    const data = await res.json();
    const historyDiv = document.getElementById("history");
    if (data.links && data.links.length > 0) {
        historyDiv.innerHTML = `
            <br>
            <ul>
                ${data.links.map(link => `
                    <li>
                        <a href="${originURL}api-v2/${link.short}" target="_blank">${originURL}api-v2/${link.short}</a>
                        <span> → </span>
                        <a href="${link.long}" target="_blank">${link.long}</a>
                    </li>
                `).join('')}
            </ul>
        `;
    } else {
        historyDiv.innerHTML = "<br> <p>Pas encore de liens.</p>";
    }
}

document.getElementById("shorten-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("url").value;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    try {
        const res = await fetch(originURL + "api-v2/", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ url })
        });
        const data = await res.json();
        if (res.ok && data.shortUrl) {
            resultDiv.innerHTML = `
            <div id="output-container">
                <div class="short-link">
                    <a href="${data.shortUrl}" target="_blank" class="short-link-url">${data.shortUrl}</a>
                </div>
                <br>
                <button class="button is-success is-inverted" id="copy_btn"> 
                    <span>Copy</span>
                    <span class="icon"><i class="fa-solid fa-copy fa-sm" style="color: #47c68d;"></i></span>
                </button>
            </div>
            `;
            document.getElementById("copy_btn").onclick = () => {
                navigator.clipboard.writeText(data.shortUrl);
            };
            updateCount();
            updateHistory();
        } else {
            resultDiv.innerHTML = `<div class="error">${data.error || "Error"}</div>`;
        }
    } catch (err) {
        resultDiv.innerHTML = `<div class="error">${err.message}</div>`;
    }
});



const menu = document.querySelector(".menu");
const menuButton = document.getElementById("menuButton");

menuButton.addEventListener("click", () => {
    menu.classList.toggle("open");
    menuButton.classList.toggle("open");
});


document.getElementById("clear-history-btn").addEventListener("click", async () => {
    if (confirm("Voulez-vous vraiment supprimer tout l'historique ?")) {
        const res = await fetch(originURL + "api-v2/history", {
            method: "DELETE",
            headers: { Accept: "application/json" }
        });
        const data = await res.json();
        if (data.success) {
            updateHistory();
            updateCount();
        }
    }
});



updateCount();
updateHistory();

