import React, { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import Image from 'next/image';

export default function SimpleGallery({ props }: { props: any }) {
    useEffect(() => {
        let lightbox: any = new PhotoSwipeLightbox({
            gallery: '#' + props.galleryID,
            children: 'a',
            pswpModule: () => import('photoswipe'),
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    return (
        <div className="pswp-gallery" id={props.galleryID}>
            {props.images.map((image: any, index: any) => (
                <a
                    href={image}
                    // data-pswp-width={image.width}
                    // data-pswp-height={image.height}
                    key={props.galleryID + '-' + index}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image className="w-auto h-auto" height={0} width={0} src={image} alt="illustration" />
                </a>
            ))}
        </div>
    );
}