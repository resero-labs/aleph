from aleph.core import settings


def expand_schemata(specific=None, deep=None):
    from banal import ensure_list
    from followthemoney import model
    # and: filter:schemata
    # or: filter:schema
    schemata = set()
    specific = ensure_list(specific)


def entity_index(schema):
    """Index that us currently written by new queries."""
    return settings.ENTITIES_INDEX


def entities_index_list():
    """Combined index to run all queries against."""
    return settings.ENTITIES_INDEX_SET


def entities_index():
    """Combined index to run all queries against."""
    return ','.join(entities_index_list())


def record_index():
    """Index that us currently written by new queries."""
    return settings.RECORDS_INDEX


def records_index():
    """Combined index to run all queries against."""
    return ','.join(settings.RECORDS_INDEX_SET)


def collections_index():
    """Combined index to run all queries against."""
    return settings.COLLECTIONS_INDEX


def all_indexes():
    return ','.join([collections_index(), entities_index(), records_index()])
