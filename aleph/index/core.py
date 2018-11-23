from banal import ensure_list
from followthemoney import model

from aleph.core import settings


def expand_schemata(specific=None, deep=None):
    # and: filter:schemata
    # or: filter:schema
    schemata = set()
    specific = ensure_list(specific)


def entities_write_index(schema):
    """Index that us currently written by new queries."""
    return settings.ENTITIES_INDEX


def entities_read_index(schema=None):
    """Combined index to run all queries against."""
    return ','.join(settings.ENTITIES_INDEX_SET)


def records_write_index():
    """Index that us currently written by new queries."""
    return settings.RECORDS_INDEX


def records_read_index():
    """Combined index to run all queries against."""
    return ','.join(settings.RECORDS_INDEX_SET)


def collections_index():
    """Combined index to run all queries against."""
    return settings.COLLECTIONS_INDEX


def all_indexes():
    return ','.join([collections_index(),
                     entities_read_index(),
                     records_read_index()])
