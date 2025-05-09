from staticjinja import Site


if __name__ == "__main__":
    env_globals = {
        "api_host": "http://localhost:5100"
    }
    site = Site.make_site(outpath="public", env_globals=env_globals)
    # enable automatic reloading
    site.render()
    