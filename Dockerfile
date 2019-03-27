FROM alephdata/aleph-base:6

# Install Python dependencies
COPY requirements-generic.txt /tmp/
RUN pip3 install -r /tmp/requirements-generic.txt && rm -rf /root/.cache

# Figure out which specific dependencies are needed for libpff
RUN apt-get -qq -y update \
    && apt-get -q -y install build-essential locales ca-certificates \
        # python deps (mostly to install their dependencies)
        python3-pip python3-dev python3-pil \
        # libraries
        libxslt1-dev libpq-dev libldap2-dev libsasl2-dev \
        zlib1g-dev libicu-dev libxml2-dev \
        # package tools
        unrar p7zip-full  \
        # Editing tool
        vim \
        # audio & video metadata
        libmediainfo-dev \
        # image processing, djvu
        imagemagick-common imagemagick mdbtools djvulibre-bin \
        libtiff5-dev libjpeg-dev libfreetype6-dev libwebp-dev \
        # tesseract
        libtesseract-dev tesseract-ocr-eng libleptonica-dev \
        # pdf processing toolkit
        poppler-utils poppler-data pst-utils \
        # document processing
        libreoffice \
        # libpff build tools
        git autoconf automake autopoint libtool pkg-config \
    && apt-get -qq -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install the libpff library for pst ingestion
RUN pip3 install -q --upgrade pip setuptools six wheel
RUN curl -SL "https://github.com/sunu/libpff/archive/attachment-name.tar.gz" | tar -xz -C /tmp/ && cd /tmp/libpff-attachment-name \
    && ./synclibs.sh && ./autogen.sh && ./configure --enable-python && make && make install \
    && python3 setup.py install

# Install the custom ingestor version that was manually built
COPY ingestors-0.10.11-py2.py3-none-any.whl /tmp/ingestors-0.10.11-py2.py3-none-any.whl
RUN pip3 install /tmp/*.whl

# Install the requirements that are specific to the project
COPY requirements-toolkit.txt /tmp/
RUN pip3 install -r /tmp/requirements-toolkit.txt && rm -rf /root/.cache

# Install aleph
COPY . /aleph
WORKDIR /aleph
ENV PYTHONPATH /aleph
RUN pip install -e /aleph
# RUN cd /usr/local/lib/python3.6/dist-packages && python3 /aleph/setup.py develop

# Configure some docker defaults:
ENV C_FORCE_ROOT=true \
    UNOSERVICE_URL=http://convert-document:3000/convert \
    ALEPH_ELASTICSEARCH_URI=http://elasticsearch:9200/ \
    ALEPH_DATABASE_URI=postgresql://aleph:aleph@postgres/aleph \
    ALEPH_BROKER_URI=amqp://guest:guest@rabbitmq:5672 \
    ALEPH_ARCHIVE_PATH=/data

# Run the green unicorn
CMD gunicorn -w 5 -b 0.0.0.0:8000 --log-level info --log-file - aleph.manage:app
