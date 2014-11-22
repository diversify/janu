import requests
import time
import json
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

def get_songs_for_years(years):
    res = dict()
    for year in years: 
        print 'Fetching songs for year {}'.format(year)
        songs = get_songs_for_year(year)
        songs = sorted(songs, key=lambda x: x.get('popularity'), reverse=True)
        res[year] = songs
        time.sleep(1)
    return res

def dump_to_file(j, filename):
    with open(filename, 'w+') as outfile:
        json.dump(j, outfile)

if __name__ == '__main__':
    data = get_songs_for_years(range(1950, 2014+1))
    dump_to_file(data, 'output.json')
