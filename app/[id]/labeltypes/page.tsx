'use client';

import React from 'react';
import { LabelTypes } from '../../../components';

export default function Page({ params }: { params: { id: string } }) {
    return <LabelTypes {...params }  />
}


