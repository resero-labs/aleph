# Steps to get Aleph working with DockerUtils

1. checkout `2.2.2`  & create branch
2. Update all `./xxx` in docker-compose.dev.yml to `/data/workspaces/<user>/code/aleph` (this is necessary as this will be running on a remote server rather than local)
3. Remove `ui` from `.dockerignore` (needed for `ui` to be copied up using `sync-up`)
4. `source dock <moniker>`
5. `sync-up`
6. `make all`
7. `make shell`
8. `aleph createuser -n Dan -e "drapp@proofpoint.com" -p test -i dan`
9. Capture output from above command. It's the API key (8e1bd85163944641bd232ff9aac59363)
10. `aleph crawldir /aleph/contrib/testdata`

search and replace:
 "./"
 "/data/workspace/drapp/code/aleph"

I'm interesting in exploring aleph, but am having difficulty getting it working from scratch. Here are the steps I've taken:

1. clone repo
2. checkout a revision (e.g. master, 2.2.3, 2.2.2, ...)
3. make all
4. make shell
5. aleph createuser ...
6. aleph crawldir /aleph/contribu/testdata

With each version I've tried, there is some failure in running the crawldir command

master: 

2.2.3: 
```
Traceback (most recent call last):
  File "/usr/local/bin/aleph", line 11, in <module>
    load_entry_point('aleph', 'console_scripts', 'aleph')()
  File "/aleph/aleph/manage.py", line 223, in main
    manager.run()
  File "/usr/local/lib/python3.6/dist-packages/flask_script/__init__.py", line 417, in run
    result = self.handle(argv[0], argv[1:])
  File "/usr/local/lib/python3.6/dist-packages/flask_script/__init__.py", line 386, in handle
    res = handle(*args, **config)
  File "/usr/local/lib/python3.6/dist-packages/flask_script/commands.py", line 216, in __call__
    return self.run(*args, **kwargs)
  File "/aleph/aleph/manage.py", line 80, in crawldir
    document = Document.by_keys(collection=collection, foreign_id=foreign_id)
  File "/aleph/aleph/model/document.py", line 217, in by_keys
    q = q.filter(Document.collection_id == collection.id)
AttributeError: 'dict' object has no attribute 'id'
```

2.2.2:
