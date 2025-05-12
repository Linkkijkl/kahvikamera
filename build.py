from staticjinja import Site
import shutil


if __name__ == "__main__":
    env_globals = {
        "api_host": "https://kattila-api.linkkijkl.fi"
    }
    site = Site.make_site(outpath="public", env_globals=env_globals)
    site.render()
    shutil.copytree("static", "public", dirs_exist_ok=True)
