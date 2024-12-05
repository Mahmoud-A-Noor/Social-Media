import { Plugin } from '@react-pdf-viewer/core';
import React from 'react';

export default function PageThumbnailPlugin({ PageThumbnail }){
    return {
        renderViewer: ({ slot }) => {
            // Replace the slot's children with the PageThumbnail element
            slot.children = PageThumbnail;

            // Reset the subSlot attributes and children
            slot.subSlot.attrs = {};
            slot.subSlot.children = <></>;

            return slot;
        },
    };
};