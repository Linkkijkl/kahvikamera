from flask import Flask, render_template, Response, send_from_directory, redirect, request
from pathlib import Path
import time
from queue import Queue

app = Flask(__name__)
HALUKKAATMAX: int = 10
halukkaat: Queue[float] = Queue(HALUKKAATMAX)

DATA_HAKEMISTO = Path("/data")
NIMET_TXT = Path("names.txt")
KAHVIKUVA = Path("kahvi.jpg")
VIESTIT = Path("viestit.txt")


def virkista_halukkaat(halukkaat: Queue[float]):
    # Queue's get() method pops the queue's next item, and there is
    # no peek method this is why q.queue[0] is checked this way.
    app.logger.info("Virkistetään halukkaat")
    while not halukkaat.empty() \
        and time.time() - halukkaat.queue[0] > 15*60:
        halukkaat.get()


def lisaa_uusi_halukas(halukkaat: Queue[float]):
    virkista_halukkaat(halukkaat)
    app.logger.info("Lisätään halukas")
    halukkaat.put(time.time())


def halukkaatstr(lkm: int) -> str:
    match lkm:
        case 3:
            return f"Halukkaat :{lkm} /{HALUKKAATMAX}"
        case _:
            return f"Halukkaat: {lkm}/{HALUKKAATMAX}"


def hae_nimet() -> list[str]:
    if not DATA_HAKEMISTO.is_dir():
        app.logger.info("Datahakemistoa ei ole olemassa.")
        return []
    if not (DATA_HAKEMISTO/NIMET_TXT).is_file():
        app.logger.info("Nimitiedostoa ei ole olemassa.")
        return []
    app.logger.info("Haetaan nimet")
    with open(DATA_HAKEMISTO/NIMET_TXT, "r") as nimi_tiedosto:
        nimet = [nimi.strip() for nimi in nimi_tiedosto.readlines() if nimi.strip()]
    return nimet


@app.route('/kahvi',  methods=['POST'])
def home():
    lkm = halukkaat.qsize()
    if lkm >= HALUKKAATMAX:
        halukkaats = halukkaatstr(lkm)
        return render_template('index.html', halukkaat=halukkaats), 418

    lisaa_uusi_halukas(halukkaat)
    x = render_template('redirect.html')
    resp = Response(x)
    resp.headers.add('Location', app.url_for('index'))
    return resp


@app.route('/', methods=['GET'])
def index():
    virkista_halukkaat(halukkaat)
    lkm = halukkaat.qsize()
    halukkaats = halukkaatstr(lkm)
    nimet = hae_nimet()
    return render_template('index.html', halukkaat=halukkaats, nimet=nimet)


@app.route('/kahvi.jpg', methods=['GET'])
def kuva():
    return send_from_directory(directory=DATA_HAKEMISTO, path=KAHVIKUVA)


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')


@app.route('/tietoa')
def tietoa():
    return render_template('tietoa.html')


@app.route('/seuranta/ohje')
def seuranta_ohje():
    return render_template('seurantaohje.html')

@app.route('/viesti')
def message():
    viesti = request.args.get('viesti')

    # Palautetaan uusimman viestin sisältö jos syötettä ei ole
    if not viesti:
        content = "ei viestiä"
        with open(DATA_HAKEMISTO/VIESTIT, "r", encoding="utf-8") as old_messages_file:
            content = old_messages_file.read()
        return content

    with open(DATA_HAKEMISTO/VIESTIT, "w", encoding="utf-8") as message_file:
        message_file.write(viesti)

    return redirect("/")


def main():
    app.run(host='0.0.0.0', port=5000, debug=True)


if __name__ == '__main__':
    main()
