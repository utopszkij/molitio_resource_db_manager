'use client';

import React from 'react';
import { Collections } from '../../../components';

export default function Page({ params }: { params: { id: string } }) {
    return <Collections { ...params } />
}


