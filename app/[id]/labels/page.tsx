'use client';

import React from 'react';
import { Labels } from '../../../components/Labels';

export default function Page({ params }: { params: { id: string } }) {
    return <Labels {...params }  />
}


