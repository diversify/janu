import requests
import time
import json
import pprint
import base64

CLIENT_ID = 'b6b5dbca8f57413aa9b0909c3a0b323c'
CLIENT_SECRET = '560a71659bca4cb796691db512dcba47'

MANUAL_PLAYLISTS = {
    '1980': {
        "owner_id": "1214809575",
        "playlist_id": "7wEVpUVrErO2uEfP99EhcB"
     },
    '1989': {
        "owner_id": "israel.kendall",
        "playlist_id": "0RQPCufJ8sFM0f6diGOqx2",
     },
    '1990': {
        "owner_id": "israel.kendall",
        "playlist_id": "2Ezq5tXBfcm08IgV6jVbD5",
     },
    '2000': {
        "owner_id": "israel.kendall",
        "playlist_id": "5FPS4YigpTkW5BReGWqQhf",
     },
    '2013': {
        "owner_id": "1214375061",
        "playlist_id": "6AihpQrTXtgDnkcQwLfxYb",
     },
    '2014': {
        "owner_id": "mochimamma",
        "playlist_id": "5ohzMZ3OBvDlHypXCBKrHa",
     },
}

def authorize():
    headers = {
        "Authorization": "Basic " + base64.b64encode("{}:{}".format(CLIENT_ID, CLIENT_SECRET))
    }

    data = { 'grant_type': 'client_credentials' }

    r = requests.post('https://accounts.spotify.com/api/token', data=data, headers=headers)

    return r.json()['access_token']

SEARCH_BASE_URL = 'https://api.spotify.com/v1/search'
GET_PLAYLIST_BASE_URL = 'https://api.spotify.com/v1/users/{}/playlists/{}/tracks'

def track_object(obj): 
    if not (obj['name'] and obj['id']):
        return None

    res = {
        'name': obj['name'],
        'song_id': obj['id'],
        'artist_name': obj['artists'][0]['name'],
        'artist_id': obj['artists'][0]['id'],
        'popularity': obj['popularity'],
    }

    if obj['preview_url']:
        res['preview_url'] = obj['preview_url']

    if obj['album']['images']:
        res['image_url'] = obj['album']['images'][0]['url']

    return res

def get_billboard_playlist(year):

    if (MANUAL_PLAYLISTS.get(str(year))):
        print 'manual'
        return MANUAL_PLAYLISTS.get(str(year))

    params = {
        "q": "billboard {}".format(year),
        "type": "playlist",
        "limit": 1
    }

    r = requests.get(SEARCH_BASE_URL, params=params)
    res = r.json()
    items = res['playlists']['items']

    if len(items) > 0:
        first_result = items[0]
        return {
            'playlist_id': first_result['id'],
            'owner_id': first_result['owner']['id']
        }
    else:
        return {}

def get_songs_for_year(year):

    DEFAULT_LIMIT = 50

    query = "year:{}".format(year)

    params = {
        "q": query,
        "type": "track",
        "limit": DEFAULT_LIMIT 
    }

    r = requests.get(SEARCH_BASE_URL, params=params)
    if (r.status_code != 200):
        print 'failed'
        print r.json()

    resp = r.json()
    tracks = resp['tracks']['items']

    return [track_object(t) for t in tracks]


def get_songs_for_year_from_playlists(year, access_token):

    results = get_billboard_playlist(year)
    if (not results):
        print 'Did not find billboard top 100 for year {}'.format(year)
        return []

    playlist_id = results.get('playlist_id')
    owner_id = results.get('owner_id')

    url = GET_PLAYLIST_BASE_URL.format(owner_id, playlist_id)
    r = requests.get(url, headers={'Authorization': 'Bearer {}'.format(access_token)})
    if (r.status_code != 200):
        print 'Request failed for playlist {}'.format(playlist_id)
        return []

    resp = r.json()
    items = resp['items']

    res = list()
    for t in items:
        o = track_object(t['track'])
        if o: res.append(o)
    return res

def get_songs_for_years(years, access_token, from_playlists=False):
    res = dict()
    for year in years: 
        print 'Fetching songs for year {}'.format(year)
        if from_playlists:
            songs = get_songs_for_year_from_playlists(year, access_token)
        else:
            songs = get_songs_for_year(year)
        songs = sorted(songs, key=lambda x: x.get('popularity'), reverse=True)
        res[year] = songs
        time.sleep(1)
    return res

def dump_to_file(j, filename):
    with open(filename, 'w+') as outfile:
        json.dump(j, outfile)

if __name__ == '__main__':

    a = authorize()
    data = get_songs_for_years(range(1957, 2014+1), a, from_playlists=True)
    data = { k: data.get(k) for k in data.keys() if len(data.get(k)) != 0 }
    dump_to_file(data, 'output.json')
