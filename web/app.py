from flask import Flask, render_template, request, Response
import time
from queue import Queue

app = Flask(__name__)

def virkista_halukkaat(halukkaat: Queue[float]):
    # Queue's get() method pops the queue's next item, and there is
    # no peek method this is why q.queue[0] is checked this way.
    app.logger.info("Virkistetään halukkaat")
    while not halukkaat.empty() \
        and halukkaat.queue[0] - time.time() > 15*60:
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


@app.route('/kahvi',  methods=['POST'])
def home():
    lkm = halukkaat.qsize()
    if lkm >= HALUKKAATMAX:
        halukkaats = halukkaatstr(lkm)
        return render_template('index.html', halukkaat=halukkaats), 418

    lisaa_uusi_halukas(halukkaat)
    x = render_template('redirect.html')
    resp = Response(x)
    resp.headers.add('Location', 'https://kattila.cafe')
    return resp

@app.route('/', methods=['GET'])
    virkista_halukkaat(halukkaat)
    lkm = halukkaat.qsize()
    halukkaats = halukkaatstr(lkm)

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/display')
def toinen_kissa():
    poista_vanhat_halukkaat()
    halukkaats = halukkaatstr() 
    return render_template('display.html', halukkaat=halukkaats, halukkaatlkm=str(len(halukkaat))+"%")

@app.route('/tietoa')
def tietoa():
    return render_template('tietoa.html')


def main():
    app.run(host='0.0.0.0', port=5000, debug=True)


if __name__ == '__main__':
    main()
