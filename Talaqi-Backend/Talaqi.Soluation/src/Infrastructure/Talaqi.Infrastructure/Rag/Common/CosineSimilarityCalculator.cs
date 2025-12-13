using System;

namespace Talaqi.Infrastructure.Rag.Common
{
    /// <summary>
    /// Calculates cosine similarity between two float vectors.
    /// </summary>
    public static class CosineSimilarityCalculator
    {
        public static float Cosine(float[] a, float[] b)
        {
            if (a == null || b == null) return 0f;
            int len = Math.Min(a.Length, b.Length);
            if (len == 0) return 0f;
            double dot = 0, na = 0, nb = 0;
            for (int i = 0; i < len; i++)
            {
                dot += a[i] * b[i];
                na += a[i] * a[i];
                nb += b[i] * b[i];
            }
            if (na == 0 || nb == 0) return 0f;
            return (float)(dot / (Math.Sqrt(na) * Math.Sqrt(nb)));
        }
    }
}
