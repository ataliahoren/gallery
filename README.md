# gallery
Highly available, RESTful API that is accessible from internet, and hosted on AWS.
Trafﬁc is load-balanced using ELB
Ofﬂine processing will is done by background worker
Image metadata is stored on MongoDB (use mLAB)
Image binary data is stored on S3
Cache layer is provided by Redis
Web client demo (1 html ﬁle, and js) that demonstrate the API.
Using Cloudinary API to get dominant color and resizing

to use it:

git clone https://github.com/ataliahoren/gallery.git

npm install

create your own cardentials om AWS and create .photoGalleryrc file in root level


**make sure you have nodejs version 4.4.5, if not, install:
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
nvm install v4.4.5
