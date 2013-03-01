function M4Zip()
{

}

M4Zip.prototype =
{
	stream:null,

	read:function(pStream)
	{
		this.stream = new M4Zip.utils.BigEndianBinaryStream(pStream);

		console.log("zip ? ");

		if(!this.isZip())
			return false;

		console.log("i am a zip file");

		this.entries = [];
		var e = new M4ZipEntry(this.stream);
		while (typeof(e.data) === "string") {
			this.entries.push(e);
			e = new M4ZipEntry(this.stream);
		}

		return this.entries;
	},

	isZip:function()
	{
		return this.stream.getByteRangeAsNumber(0, 4)===M4Zip.ZIP_HEADER_SIGNATURE;
	}
};

M4Zip.ZIP_HEADER_SIGNATURE  = 0x04034b50;

M4Zip.EXTRA_DATA_SIGNATURE  = 0x08064b50;

M4Zip.COMPRESSION_DEFLATED = 8;

function M4ZipEntry(pStream)
{
	this.signature = pStream.getNextBytesAsNumber(4);
	if(this.signature !== M4Zip.ZIP_HEADER_SIGNATURE)
		return;

	this.version = pStream.getNextBytesAsNumber(2);
	this.bit_flag = pStream.getNextBytesAsNumber(2);
	this.compression = pStream.getNextBytesAsNumber(2);
	this.file_edit_time = pStream.getNextBytesAsNumber(2);
	this.file_edit_date = pStream.getNextBytesAsNumber(2);
	this.crc_32 = pStream.getNextBytesAsNumber(4);
	this.compressed_size = pStream.getNextBytesAsNumber(4);
	this.uncompressed_size = pStream.getNextBytesAsNumber(4);

	this.fn_length = pStream.getNextBytesAsNumber(2);
	this.ef_length = pStream.getNextBytesAsNumber(2);

	this.file_name = pStream.getNextBytesAsString(this.fn_length);
	this.extra_field = pStream.getNextBytesAsString(this.ef_length);
	this.data = pStream.getNextBytesAsString(this.compressed_size);
	switch(this.compression)
	{
		case M4Zip.COMPRESSION_DEFLATED:
			var b = new M4ZipInflateImp();
			b.inflate(this.data);
		break
	}
}

M4ZipEntry.prototype ={};


function M4ZipInflateImp(){}

M4ZipInflateImp.DYNAMIC = 2;

M4ZipInflateImp.MASK = [
	0x0000,
	0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff,
	0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff
];

M4ZipInflateImp.BORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

M4ZipInflateImp.prototype =
{
	_stream:null,
	_lastBlock:false,
	_bitLookup:null,
	inflate:function(pStream)
	{
		var r;
		this._stream = new M4Zip.utils.BitStream(pStream, M4ZipInflateImp.MASK);
		this._inflate_block();
		return false;
		do
		{
			if((r = this._inflate_block())!=0)
				return r;
		}
		while(!this._lastBlock)
	},

	_inflate_block:function()
	{
		this._lastBlock = this._stream.getNext(1)===1;
		console.log(this._lastBlock);
		var type = this._stream.getNext(2);

		switch(type)
		{
			case M4ZipInflateImp.DYNAMIC:
				return this._inflate_dynamic();
			break;
			default:
				console.log("not implemented yet !");
			break;
		}
		return 2;
	},

	_inflate_dynamic:function()
	{

		var nl = this._stream.getNext(5) + 257;    /* number of literal/length codes */
		var nd = this._stream.getNext(5) + 1;      /* number of distance codes */
		var nb = this._stream.getNext(4) + 4;      /* number of bit length codes */

		var ll = [];

		if(nl > 286 || nd > 30)
		{
			console.log("bad length !! nl : "+nl+", nd : "+nd);
			return 1;
		}

		for(var i = 0; i<nb; i++)
		{
			ll[M4ZipInflateImp.BORDER[i]] = this._stream.getNext(3);
		}
		
	    for (; i < 19; i++)
			ll[M4ZipInflateImp.BORDER[i]] = 0;

		this._bitLookup = 7;
	}
};

/**
 * https://github.com/augustl/js-unzip/blob/master/js-unzip.js
 */
M4Zip.utils =
{
	BigEndianBinaryStream:function(pStream)
	{
		this.stream = pStream;
		this.reset();
	},

	BitStream:function(pStream, pMask)
	{
		this.mask = pMask;
		this.stream = pStream;
		this.reset();
	}
};

M4Zip.utils.BitStream.prototype =
{
	mask:null,
	stream:null,
	currentIndex:0,
	length:0,
	buffer:0,

	reset:function()
	{
		this.currentIndex = 0;
	},

	getNext:function(pN)
	{
		this.need(pN);
		var r = this.get(pN);
		this.dump(pN);
		return r;
	},

	getByte:function()
	{
        if(this.stream.length == this.currentIndex)
            return -1;
        return this.stream.charCodeAt(this.currentIndex++) & 0xff;
	},

	need:function(pN)
	{
        while(this.length < pN)
        {
            this.buffer |= this.getByte() << this.length;
            this.length += 8;
        }
	},

	get:function(pN)
	{
        return this.buffer & this.mask[pN];
	},

	dump:function(pN)
	{
        this.buffer >>= pN;
        this.length -= pN;
	}
};

M4Zip.utils.BigEndianBinaryStream.prototype =
{
	stream:null,
	currentByteIndex:0,

	reset:function()
	{
		this.currentByteIndex = 0;
	},

	getByteAt:function(pIndex)
	{
		return this.stream.charCodeAt(pIndex);
	},

	getNextBytesAsNumber: function (steps) {
		var res = this.getByteRangeAsNumber(this.currentByteIndex, steps);
		this.currentByteIndex += steps;
		return res;
	},

	getNextBytesAsString: function (steps) {
		var res = this.getByteRangeAsString(this.currentByteIndex, steps);
		this.currentByteIndex += steps;
		return res;
	},
	
	// Big endian, so we're going backwards.
	getByteRangeAsNumber: function (index, steps) {
		var result = 0;
		var i = index + steps - 1;
		while (i >= index) {
			result = (result << 8) + this.getByteAt(i);
			i--;
		}
		return result;
	},

	getByteRangeAsString: function (index, steps) {
		var result = "";
		var max = index + steps;
		var i = index;
		while (i < max) {
			var charCode = this.getByteAt(i);
			result += String.fromCharCode(charCode);
			// Accounting for multi-byte strings.
			max -= Math.floor(charCode / 0xff);
			i++;
		}
		return result;
	}
};

var Huft =
{
	build:function(b, n, s, d, e, t, m)
	{
//		  var a;                   /* counter for codes of length k */
//		  var c;           /* bit length count table */
//		  var f;                   /* i repeats in table every f entries */
//		  var g;                        /* maximum code length */
//		  var h;                        /* table level */
//		  var i;          /* counter, current code */
//		  var j;          /* counter */
//		  var k;               /* number of bits in current code */
//		  var l;                        /* bits per table (returned in m) */
//		  var p;         /* pointer into c[], b[], or v[] */
//		  var q;      /* points to current table */
//		  var r;                /* table entry for structure assignment */
//		  var u;         /* table stack */
//		  var v;            /* values in order of bit length */
//		  var w;               /* bits before this table == (l * h) */
//		  var x;           /* bit offsets, then code stack */
//		  var xp;                 /* pointer into x */
//		  var y;                        /* number of dummy codes added */
//		  var z;                   /* number of entries in current table */
//
//		  p = b;  i = n;
//		  do {
//			c[*p]++;                    /* assume all entries <= BMAX */
//			p++;                      /* Can't combine with above line (Solaris bug) */
//		  } while (--i);
//		  if (c[0] == n)                /* null input--all zero length codes */
//		  {
//			*t = (struct huft *)NULL;
//			*m = 0;
//			return 0;
//		  }
//
//
//		  /* Find minimum and maximum length, bound *m by those */
//		  l = *m;
//		  for (j = 1; j <= BMAX; j++)
//			if (c[j])
//			  break;
//		  k = j;                        /* minimum code length */
//		  if ((unsigned)l < j)
//			l = j;
//		  for (i = BMAX; i; i--)
//			if (c[i])
//			  break;
//		  g = i;                        /* maximum code length */
//		  if ((unsigned)l > i)
//			l = i;
//		  *m = l;
//
//
//		  /* Adjust last length count to fill out codes, if needed */
//		  for (y = 1 << j; j < i; j++, y <<= 1)
//			if ((y -= c[j]) < 0)
//			  return 2;                 /* bad input: more codes than bits */
//		  if ((y -= c[i]) < 0)
//			return 2;
//		  c[i] += y;
//
//
//		  /* Generate starting offsets into the value table for each length */
//		  x[1] = j = 0;
//		  p = c + 1;  xp = x + 2;
//		  while (--i) {                 /* note that i == g from above */
//			*xp++ = (j += *p++);
//		  }
//
//
//		  /* Make a table of values in order of bit lengths */
//		  p = b;  i = 0;
//		  do {
//			if ((j = *p++) != 0)
//			  v[x[j]++] = i;
//		  } while (++i < n);
//
//
//		  /* Generate the Huffman codes and for each, make the table entries */
//		  x[0] = i = 0;                 /* first Huffman code is zero */
//		  p = v;                        /* grab values in bit order */
//		  h = -1;                       /* no tables yet--level -1 */
//		  w = -l;                       /* bits decoded == (l * h) */
//		  u[0] = (struct huft *)NULL;   /* just to keep compilers happy */
//		  q = (struct huft *)NULL;      /* ditto */
//		  z = 0;                        /* ditto */
//
//		  /* go through the bit lengths (k already is bits in shortest code) */
//		  for (; k <= g; k++)
//		  {
//			a = c[k];
//			while (a--)
//			{
//			  /* here i is the Huffman code of length k bits for value *p */
//			  /* make tables up to required level */
//			  while (k > w + l)
//			  {
//				h++;
//				w += l;                 /* previous table always l bits */
//
//				/* compute minimum size table less than or equal to l bits */
//				z = (z = g - w) > (unsigned)l ? l : z;  /* upper limit on table size */
//				if ((f = 1 << (j = k - w)) > a + 1)     /* try a k-w bit table */
//				{                       /* too few codes for k-w bit table */
//				  f -= a + 1;           /* deduct codes from patterns left */
//				  xp = c + k;
//				  while (++j < z)       /* try smaller tables up to z bits */
//				  {
//					if ((f <<= 1) <= *++xp)
//					  break;            /* enough codes to use up j bits */
//					f -= *xp;           /* else deduct codes from patterns */
//				  }
//				}
//				z = 1 << j;             /* table entries for j-bit table */
//
//				/* allocate and link in new table */
//				if ((q = (struct huft *)malloc((z + 1)*sizeof(struct huft))) ==
//					(struct huft *)NULL)
//				{
//				  if (h)
//					huft_free(u[0]);
//				  return 3;             /* not enough memory */
//				}
//				hufts += z + 1;         /* track memory usage */
//				*t = q + 1;             /* link to list for huft_free() */
//				*(t = &(q->v.t)) = (struct huft *)NULL;
//				u[h] = ++q;             /* table starts after link */
//
//				/* connect to last table, if there is one */
//				if (h)
//				{
//				  x[h] = i;             /* save pattern for backing up */
//				  r.b = (uch)l;         /* bits to dump before this table */
//				  r.e = (uch)(16 + j);  /* bits in this table */
//				  r.v.t = q;            /* pointer to this table */
//				  j = i >> (w - l);     /* (get around Turbo C bug) */
//				  u[h-1][j] = r;        /* connect to last table */
//				}
//			  }
//
//			  /* set up table entry in r */
//			  r.b = (uch)(k - w);
//			  if (p >= v + n)
//				r.e = 99;               /* out of values--invalid code */
//			  else if (*p < s)
//			  {
//				r.e = (uch)(*p < 256 ? 16 : 15);    /* 256 is end-of-block code */
//				r.v.n = (ush)(*p);             /* simple code is just the value */
//			p++;                           /* one compiler does not like *p++ */
//			  }
//			  else
//			  {
//				r.e = (uch)e[*p - s];   /* non-simple--look up in lists */
//				r.v.n = d[*p++ - s];
//			  }
//
//			  /* fill code-like entries with r */
//			  f = 1 << (k - w);
//			  for (j = i >> w; j < z; j += f)
//				q[j] = r;
//
//			  /* backwards increment the k-bit code i */
//			  for (j = 1 << (k - 1); i & j; j >>= 1)
//				i ^= j;
//			  i ^= j;
//
//			  /* backup over finished tables */
//			  while ((i & ((1 << w) - 1)) != x[h])
//			  {
//				h--;                    /* don't need to update q */
//				w -= l;
//			  }
//			}
//		  }
//
//
//		  /* Return true (1) if we were given an incomplete table */
//		  return y != 0 && g != 1;
	}
};