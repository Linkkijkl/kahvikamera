from staticjinja import Site


if __name__ == "__main__":
    env_globals = {
        "api_host": "https://kattila-api.linkkijkl.fi"
    }
    site = Site.make_site(outpath="public", env_globals=env_globals)
    # enable automatic reloading
    site.render()
