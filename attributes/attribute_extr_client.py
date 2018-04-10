
def extr_from_text(text):
    import pyjsonrpc
    http_client = pyjsonrpc.HttpClient(
        url = "http://localhost:13813"
    )
    # It is also possible to use the *method* name as *attribute* name.
    res = http_client.from_text(text)
    return res

def extr_from_url(url):
    import pyjsonrpc
    http_client = pyjsonrpc.HttpClient(
        url = "http://localhost:13813"
    )
    # It is also possible to use the *method* name as *attribute* name.
    res = http_client.from_url(url)
    return res
