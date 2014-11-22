import requests
import pprint

BASE_URL = 'https://api.spotify.com/v1/search'
DEFAULT_LIMIT = 50

def track_object(obj): 
    return {
        'name': obj['name'],
        'song_id': obj['id'],
        'artist_name': obj['artists'][0]['name'],
        'artist_id': obj['artists'][0]['id'],
        'popularity': obj['popularity'],
        'preview_url': obj['preview_url'],
    }

def get_songs_for_year(year, limit=None):
    if not limit:
        limit = DEFAULT_LIMIT

    query = "year:{}".format(year)

    params = {
        "q": query,
        "type": "track",
        "limit": DEFAULT_LIMIT 
    }

    r = requests.get(BASE_URL, params=params)
    if (r.status_code != 200):
        print 'failed'
        print r.json()

    resp = r.json()
    tracks = resp['tracks']['items']

    return [track_object(t) for t in tracks]

pprint.pprint(get_songs_for_year(2000))
