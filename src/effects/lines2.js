(function(tgen) {

    // lines2
    tgen.effect('lines2', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        type: "random",
        size: [0.1, 21],
        count: [1, 42],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function($g, params) {

        if (params.type === "random") {
            params.type = $g.randIntSeed(0, 1) === 1 ? 'vertical' : 'horizontal';
        }

        var item = null;

        for (var i = 0; i < params.count; i++) {

            if (params.elements != undefined) {

                item = params.elements[i];

            } else {

                item = {
                    size: $g.randByArraySeed(params.size, true),
                    d: $g.randRealSeed(0.1, 100)
                };

            }

            if (params.type == 'vertical') {
                $g.shape.rect($g, $g.percentX(item.d), 0, $g.percentX(item.size), $g.texture.height);
            } else {
                $g.shape.rect($g, 0, $g.percentX(item.d), $g.texture.width, $g.percentX(item.size));
            }

        }

        return params;

    });

})(SeamlessTextureGenerator);