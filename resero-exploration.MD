# Steps to get Aleph working with DockerUtils

Do the following:

1. clone alephdata/aleph
2. Update all `./xxx` in docker-compose.dev.yml to `/data/workspaces/<user>/code/aleph` (skip this if running locally)
3. Remove `ui` from `.dockerignore` (skip if running locally)
4. replace lines 53-57 in ui/config/env.js with `process.env.NODE_PATH='/alephui';`
5. `source dock <moniker>`
6. Add security group that opens ElasticSearch and Postgres ports (id: snap-0e0de262ec8c9b19e, name: Aleph)
7. Modify docker-compose.dev.yml to introduce dejavu (for exploration of elasticsearch)
8. `ssh-dock`
9. `sysctl -w vm.max_map_count=262144`
10. ctrl-d
11. `sync-up`
12. `make all`
13. `make shell`
14. `aleph createuser --email="drapp@proofpoint.com" --name="Dan" --is_admin --password=123abc dan`
15. Capture output from above command. It's the API key (976ab6e2eb8146e18b6db0901b7ee7a0)
16. `aleph crawldir /aleph/contrib/testdata`

