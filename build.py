from staticjinja import Site
from os import system


if __name__ == "__main__":
    env_globals = {
        "api_host": "https://kattila-api.linkkijkl.fi"
    }
    site = Site.make_site(outpath="public", env_globals=env_globals)
    site.render()
    system("cp -R static/* public/")
