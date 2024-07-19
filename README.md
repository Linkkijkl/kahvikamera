# Kahvikamera

Hosted at: <https://kattila.cafe>

Kattilan kamerapalvelimen tilanne:
- systemd service kahvikamera.service luotu, vaihdettava käynnistämään käyttäjänä 'a'
- käyttäjän (ryhmä)oikeuksia lisättävä tarvittaessa, jotta olisi oikeus videolaitteisiin.
- käynnistetään tällä loitsulla `start.sh`, mikä on palvelinkoneella tilapäisesti vain paikallisesti

TODO:

- Kuvan tallennus ennen lähetystä välimuistiin levyn sijaan.
- SSH control socket
- Parempi dokumentaatio
- Kahvin määrän arviointi

## Miten kahvikamera toimii

![toiminta](kattila/images/cafeSystem.png)
